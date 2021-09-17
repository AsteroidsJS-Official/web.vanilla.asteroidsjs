import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnDestroy,
  IOnLateLoop,
  ISocketData,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { LGSocketService } from '../../services/lg-socket.service'

import { Asteroid } from './asteroid.entity'
import { Bullet } from './bullet.entity'

import { UserService } from '../../services/user.service'

import { CircleCollider2 } from '../../components/colliders/circle-collider2.component'
import { Drawer } from '../../components/drawer.component'
import { Health } from '../../components/health.component'
import { Input } from '../../components/input.component'
import { RenderOverflow } from '../../components/renderers/render-overflow.component'
import { Rigidbody } from '../../components/rigidbody.component'
import { Transform } from '../../components/transform.component'

import { ICollision2 } from '../../interfaces/collision2.interface'
import { IOnTriggerEnter } from '../../interfaces/on-trigger-enter.interface'

import { Single } from '../../scenes/single.scene'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
@Entity({
  services: [UserService, LGSocketService],
  components: [
    Drawer,
    RenderOverflow,
    {
      class: CircleCollider2,
      use: {
        localPosition: new Vector2(0, 15),
        dimensions: new Rect(20, 20),
      },
    },
    {
      class: CircleCollider2,
      use: {
        localPosition: new Vector2(0, -10),
        dimensions: new Rect(30, 30),
      },
    },
    {
      class: CircleCollider2,
      use: {
        localPosition: new Vector2(20, -17),
        dimensions: new Rect(12, 12),
      },
    },
    {
      class: CircleCollider2,
      use: {
        localPosition: new Vector2(-20, -17),
        dimensions: new Rect(12, 12),
      },
    },
    {
      id: '__spaceship_transform__',
      class: Transform,
    },
    {
      id: '__spaceship_rigidbody__',
      class: Rigidbody,
    },
    {
      class: Input,
      use: {
        force: 0.01,
        angularForce: 0.000003,
      },
    },
  ],
})
export class Spaceship
  extends AbstractEntity
  implements IOnAwake, IDraw, IOnLateLoop, IOnTriggerEnter, IOnDestroy
{
  tag = Spaceship.name

  public isShooting = false

  private userService: UserService

  private lgSocketService: LGSocketService

  /**
   * Property responsible for the spaceship bullet velocity.
   */
  private readonly bulletVelocity = 0.6

  /**
   * Property responsible for the spaceship last bullet time.
   */
  private lastShot: Date

  /**
   * Property that contains the spaceship position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property that contains the spaceship physics.
   */
  private rigidbody: Rigidbody

  private image = new Image()

  public health: Health

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
    this.userService = this.getService(UserService)

    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
    this.health = this.getComponent(Health)
  }

  onStart(): void {
    this.image.src = `./assets/svg/spaceship-${this.userService.spaceshipImage}.svg`
    this.health.color = this.userService.spaceshipColor
  }

  onDestroy(): void {
    this.lgSocketService.emit('destroy', this.id)
  }

  onTriggerEnter(collision: ICollision2): void {
    if (collision.entity2.tag?.includes(Bullet.name)) {
      return
    } else if (collision.entity2.tag?.includes(Asteroid.name)) {
      console.log('entered')

      const asteroid = collision.entity2 as unknown as Asteroid
      this.health.hurt(asteroid.asteroidSize + 1 * 8)
      if (this.health.health <= 0) {
        this.scene.unload(this.scene).then(() => {
          this.scene.load(Single)
        })
      }
    }

    this.scene.unload(this.scene)
    this.scene.load(Single)
  }

  onLateLoop(): void {
    this.lgSocketService.emit('update-slaves', {
      id: this.id,
      data: {
        position: this.transform.position,
        dimensions: this.transform.dimensions,
        rotation: this.transform.rotation,
        health: this.health.health,
        maxHealth: this.health.maxHealth,
      },
    })
  }

  public draw(): void {
    this.getContext().translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )

    // this.getContext().fillStyle = this.spaceshipColor
    // this.getContext().textAlign = 'center'
    // this.getContext().canvas.style.letterSpacing = '0.75px'
    // this.getContext().font = '12px Neptunus'
    // this.getContext().fillText(
    //   this.nickname,
    //   0,
    //   0 - (this.transform.dimensions.height / 2 + 20),
    // )

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

  public shoot(): void {
    if (this.lastShot && new Date().getTime() - this.lastShot.getTime() < 400) {
      return
    }

    this.lastShot = new Date()

    this.createBullet((2 * Math.PI) / 5, 7.5)
    this.createBullet(-(2 * Math.PI) / 5, 5.5)

    this.createBullet((2 * Math.PI) / 7, 9.5)
    this.createBullet(-(2 * Math.PI) / 7, 7.5)
  }

  private createBullet(localPosition: number, offset: number): void {
    const rotation = this.transform.rotation
    const position = Vector2.sum(
      this.transform.position,
      Vector2.multiply(
        new Vector2(
          Math.sin(this.transform.rotation + localPosition),
          Math.cos(this.transform.rotation + localPosition),
        ),
        this.transform.dimensions.width / 2 - offset,
      ),
    )
    const velocity = Vector2.sum(
      this.rigidbody.velocity,
      Vector2.multiply(this.direction, this.bulletVelocity),
    )

    const bullet = this.instantiate({
      use: {
        tag: `${Bullet.name}`,
      },
      entity: Bullet,
      components: [
        {
          id: '__bullet_transform__',
          use: {
            position,
            rotation,
          },
        },
        {
          id: '__bullet_rigidbody__',
          use: {
            velocity,
          },
        },
      ],
    })

    this.lgSocketService.emit('instantiate', {
      id: bullet.id,
      type: Bullet.name,
      data: {
        position,
        rotation,
        velocity,
      },
    } as ISocketData)
  }
}
