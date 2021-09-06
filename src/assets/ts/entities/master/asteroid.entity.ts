import {
  Entity,
  AbstractEntity,
  IOnAwake,
  IOnStart,
  IDraw,
  IOnLoop,
  IOnDestroy,
  Rect,
  isOverflowingX,
  isOverflowingY,
  Vector2,
} from '@asteroidsjs'

import { socket } from '../../socket'

import { Drawer } from '../../components/drawer.component'
import { RenderOverflow } from '../../components/renderers/render-overflow.component'
import { Render } from '../../components/renderers/render.component'
import { Rigidbody } from '../../components/rigidbody.component'
import { Transform } from '../../components/transform.component'

import asteroidLg1 from '../../../svg/asteroid-lg-1.svg'
import asteroidLg2 from '../../../svg/asteroid-lg-2.svg'
import asteroidLg3 from '../../../svg/asteroid-lg-3.svg'
import asteroidMd1 from '../../../svg/asteroid-md-1.svg'
import asteroidMd2 from '../../../svg/asteroid-md-2.svg'
import asteroidSm from '../../../svg/asteroid-sm.svg'
import asteroidXs from '../../../svg/asteroid-xs.svg'

@Entity({
  components: [
    Render,
    Drawer,
    {
      id: '__asteroid_transform__',
      class: Transform,
    },
    {
      id: '__asteroid_rigidbody__',
      class: Rigidbody,
    },
  ],
})
export class Asteroid
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw, IOnLoop, IOnDestroy
{
  private transform: Transform

  private _asteroidSize: number

  public image: HTMLImageElement

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  public onStart(): void {
    this.image = new Image()
    if (this._asteroidSize === 0) {
      this.image.src = asteroidXs
    } else if (this._asteroidSize === 1) {
      this.image.src = asteroidSm
    } else if (this._asteroidSize === 2) {
      const mediumAsteroids = [asteroidMd1, asteroidMd2]
      this.image.src =
        mediumAsteroids[Math.floor(Math.random() * mediumAsteroids.length)]
    } else {
      const largeAsteroids = [asteroidLg1, asteroidLg2, asteroidLg3]
      this.image.src =
        largeAsteroids[Math.floor(Math.random() * largeAsteroids.length)]
    }

    this.transform.dimensions = new Rect(
      10 * ((this._asteroidSize + 2) * 2),
      10 * ((this._asteroidSize + 2) * 2),
    )

    setTimeout(() => {
      if (this._asteroidSize > 0) {
        this.generateAsteroidFragments(2)
      }

      this.destroy(this)
    }, 6000)
  }

  public onDestroy(): void {
    socket.emit('destroy', this.id)
  }

  public onLoop(): void {
    const overflowingX = isOverflowingX(
      this.game.getContext().canvas.width,
      this.transform.position.x,
      this.transform.totalDimensions.width,
    )
    const overflowingY = isOverflowingY(
      this.game.getContext().canvas.height,
      this.transform.position.y,
      this.transform.totalDimensions.height,
    )

    if (
      !overflowingX &&
      !overflowingY &&
      this.getComponent(Render) &&
      !this.getComponent(RenderOverflow)
    ) {
      this.addComponent(RenderOverflow)
      this.destroy(this.getComponent(Render))
    }

    socket.emit('update-slaves', {
      id: this.id,
      data: {
        position: this.transform.position,
        rotation: this.transform.rotation,
      },
    })
  }

  public draw(): void {
    this.drawAsteroid()
  }

  /**
   * Generates two new asteroids from the current asteroid.
   *
   * @param amount The amount of fragments to be generated.
   */
  private generateAsteroidFragments(amount: number): void {
    for (let i = 0; i < amount; i++) {
      const rotation = Math.random() * 2 * Math.PI
      const direction = new Vector2(Math.sin(rotation), Math.cos(rotation))
      const position = new Vector2(
        this.transform.position.x,
        this.transform.position.y,
      )

      const fragment = this.instantiate({
        use: {
          asteroidSize: this._asteroidSize - 1,
        },
        entity: Asteroid,
        components: [
          {
            id: '__asteroid_transform__',
            use: {
              rotation,
              position,
            },
          },
          {
            id: '__asteroid_rigidbody__',
            use: {
              velocity: Vector2.multiply(direction.normalized, 2),
              friction: 0,
              mass: 15 * this._asteroidSize,
              maxAngularVelocity: 0.09,
              angularVelocity: 0.05 / this._asteroidSize,
            },
          },
        ],
      })

      socket.emit('instantiate', {
        id: fragment.id,
        type: Asteroid.name,
        data: {
          asteroidSize: fragment._asteroidSize,
          image: fragment.image.src,
          rotation,
          position,
        },
      })
    }
  }

  private drawAsteroid(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    this.game.getContext().rotate(this.transform.rotation)

    this.game.getContext().shadowColor = 'black'
    this.game.getContext().shadowBlur = 5

    this.game
      .getContext()
      .drawImage(
        this.image,
        0 - this.transform.dimensions.width / 2,
        0 - this.transform.dimensions.height / 2,
        this.transform.dimensions.width,
        this.transform.dimensions.height,
      )

    this.game.getContext().shadowColor = 'transparent'
    this.game.getContext().shadowBlur = 0

    this.game.getContext().rotate(-this.transform.rotation)
    this.game
      .getContext()
      .translate(
        -this.transform.canvasPosition.x,
        -this.transform.canvasPosition.y,
      )
  }
}
