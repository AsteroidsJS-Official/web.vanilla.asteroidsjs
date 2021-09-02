import { socket } from '../socket'

import { isOverflowingX, isOverflowingY } from '../engine/utils/overflow'
import { uuid } from '../engine/utils/validations'

import asteroid0 from '../../svg/asteroid-0.svg'
import asteroid1 from '../../svg/asteroid-1.svg'
import asteroid2 from '../../svg/asteroid-2.svg'
import asteroid3 from '../../svg/asteroid-3.svg'
import asteroid4 from '../../svg/asteroid-4.svg'
import { RenderOverflow } from '../components/render-overflow.component'
import { Render } from '../components/render.component'
import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'
import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'

@Entity({
  components: [Transform, Rigidbody, Render],
})
export class Asteroid
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw, IOnLoop
{
  private transform: Transform

  private rigidbody: Rigidbody

  private _asteroidSize: number

  private image: HTMLImageElement

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  public onStart(): void {
    this.image = new Image()
    if (this._asteroidSize === 0) {
      this.image.src = asteroid0
    } else if (this._asteroidSize === 1) {
      this.image.src = asteroid1
    } else if (this._asteroidSize === 2) {
      this.image.src = asteroid2
    } else if (this._asteroidSize === 3) {
      this.image.src = asteroid3
    } else {
      this.image.src = asteroid4
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
    this.drawCircle()
  }

  /**
   * Generates two new asteroids from the current asteroid.
   *
   * @param amount The amount of fragments to be generated.
   */
  private generateAsteroidFragments(amount: number): void {
    for (let i = 0; i < amount; i++) {
      const id = uuid()
      const rotation = Math.random() * 2 * Math.PI
      const direction = new Vector2(Math.sin(rotation), Math.cos(rotation))

      this.instantiate({
        use: {
          id,
          asteroidSize: this._asteroidSize - 1,
        },
        entity: Asteroid,
        properties: [
          {
            for: Transform,
            use: {
              rotation,
              position: new Vector2(
                this.transform.position.x,
                this.transform.position.y,
              ),
            },
          },
          {
            for: Rigidbody,
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
    }
  }

  private drawCircle(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    this.game.getContext().rotate(this.transform.rotation)

    // this.game.getContext().beginPath()
    // this.game.getContext().fillStyle = '#484848'
    // this.game
    //   .getContext()
    //   .arc(0, 0, this.transform.dimensions.width / 2, 0, 2 * Math.PI)
    // this.game.getContext().fill()
    this.game
      .getContext()
      .drawImage(
        this.image,
        0 - this.transform.dimensions.width / 2,
        0 - this.transform.dimensions.height / 2,
        this.transform.dimensions.width,
        this.transform.dimensions.height,
      )

    this.game.getContext().rotate(-this.transform.rotation)
    this.game
      .getContext()
      .translate(
        -this.transform.canvasPosition.x,
        -this.transform.canvasPosition.y,
      )
  }
}
