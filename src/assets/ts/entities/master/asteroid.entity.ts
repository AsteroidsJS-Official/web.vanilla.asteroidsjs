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

import { LGSocketService } from '../../services/lg-socket.service'

import { Bullet } from './bullet.entity'

import { UserService } from '../../services/user.service'

import { CircleCollider2 } from '../../components/colliders/circle-collider2.component'
import { Drawer } from '../../components/drawer.component'
import { Health } from '../../components/health.component'
import { RenderOverflow } from '../../components/renderers/render-overflow.component'
import { Render } from '../../components/renderers/render.component'
import { Rigidbody } from '../../components/rigidbody.component'
import { Transform } from '../../components/transform.component'

import { ICollision2 } from '../../interfaces/collision2.interface'
import { IOnTriggerEnter } from '../../interfaces/on-trigger-enter.interface'

import asteroidLg1 from '../../../svg/asteroid-lg-1.svg'
import asteroidLg2 from '../../../svg/asteroid-lg-2.svg'
import asteroidLg3 from '../../../svg/asteroid-lg-3.svg'
import asteroidMd1 from '../../../svg/asteroid-md-1.svg'
import asteroidMd2 from '../../../svg/asteroid-md-2.svg'
import asteroidSm from '../../../svg/asteroid-sm.svg'
import asteroidXs from '../../../svg/asteroid-xs.svg'

@Entity({
  services: [UserService, LGSocketService],
  components: [
    Render,
    Drawer,
    CircleCollider2,
    {
      id: '__asteroid_transform__',
      class: Transform,
    },
    {
      id: '__asteroid_rigidbody__',
      class: Rigidbody,
    },
    {
      id: '__asteroid_health__',
      class: Health,
    },
  ],
})
export class Asteroid
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw, IOnLoop, IOnDestroy, IOnTriggerEnter
{
  private userService: UserService

  private lgSocketService: LGSocketService

  private transform: Transform

  private health: Health

  private _asteroidSize: number

  private timesCollided = 0

  private wasDestroyed = false

  public image: HTMLImageElement

  public tag = Asteroid.name

  public isFragment = false

  public get asteroidSize(): number {
    return this._asteroidSize
  }

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.userService = this.getService(UserService)
    this.lgSocketService = this.getService(LGSocketService)
    this.transform = this.getComponent(Transform)
    this.health = this.getComponent(Health)
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

    this.health.health$.subscribe((value) => {
      this.lgSocketService.emit('change-health', { id: this.id, amount: value })
    })
  }

  public onDestroy(): void {
    this.lgSocketService.emit('destroy', this.id)
  }

  public onTriggerEnter(collision: ICollision2): void {
    if (this.wasDestroyed || collision.entity2.tag?.includes(Asteroid.name)) {
      return
    }

    if (collision.entity2.tag?.includes(Bullet.name)) {
      this.destroy(collision.entity2)
      this.health.hurt(20)
    } else {
      this.health.hurt(this.health.maxHealth)
    }

    if (this.health.health > 0) {
      return
    }

    if (collision.entity2.tag?.includes(Bullet.name)) {
      this.userService.increaseScore(this._asteroidSize + 1)
    }

    if (this._asteroidSize > 0) {
      this.generateAsteroidFragments(this._asteroidSize <= 2 ? 1 : 2)
    }

    this.wasDestroyed = true

    this.destroy(this)
  }

  public onLoop(): void {
    const overflowingX = isOverflowingX(
      this.getContext().canvas.width,
      this.transform.position.x,
      this.transform.totalDimensions.width,
    )
    const overflowingY = isOverflowingY(
      this.getContext().canvas.height,
      this.transform.position.y,
      this.transform.totalDimensions.height,
    )

    if (
      this.getComponent(Render) &&
      !this.getComponent(RenderOverflow) &&
      (this.isFragment || (!overflowingX && !overflowingY))
    ) {
      this.addComponent(RenderOverflow)
      this.destroy(this.getComponent(Render))
    }
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

      const velocity = Vector2.multiply(
        direction.normalized,
        0.1 *
          Math.floor(Math.random() * (5 - this._asteroidSize - 2) + 2) *
          -0.7,
      )

      const fragment = this.instantiate({
        use: {
          asteroidSize: this._asteroidSize - 1,
          isFragment: true,
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
              velocity,
              mass: 15 * this._asteroidSize,
              maxAngularVelocity: 0.005,
              angularVelocity: 0.005 / this._asteroidSize,
            },
          },
          {
            id: '__asteroid_health__',
            use: {
              color: '#8d8d8d',
              maxHealth: this._asteroidSize * 20,
              health: this._asteroidSize * 20,
            },
          },
        ],
      })

      this.lgSocketService.emit('instantiate', {
        id: fragment.id,
        type: Asteroid.name,
        data: {
          asteroidSize: fragment._asteroidSize,
          image: fragment.image.src,
          rotation,
          position,
          velocity,
          mass: 15 * this._asteroidSize,
          maxAngularVelocity: 0.005,
          angularVelocity: 0.005 / this._asteroidSize,
          isFragment: true,
          color: '#8d8d8d',
          maxHealth: this._asteroidSize * 20,
          health: this._asteroidSize * 20,
        },
      })
    }
  }

  private drawAsteroid(): void {
    this.getContext().translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.getContext().rotate(this.transform.rotation)

    this.getContext().beginPath()
    this.getContext().drawImage(
      this.image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.getContext().closePath()

    this.getContext().rotate(-this.transform.rotation)
    this.getContext().translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
