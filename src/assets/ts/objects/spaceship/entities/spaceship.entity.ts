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

import { SocketService } from '../../../shared/services/socket.service'

import { Asteroid } from '../../asteroid/entities/asteroid.entity'
import { Bullet } from '../../bullet/entities/bullet.entity'

import { GameService } from '../../../shared/services/game.service'
import { UserService } from '../../../shared/services/user.service'

import { CircleCollider2 } from '../../../shared/components/colliders/circle-collider2.component'
import { Drawer } from '../../../shared/components/drawer.component'
import { Health } from '../../../shared/components/health.component'
import { RenderOverflow } from '../../../shared/components/renderers/render-overflow.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'
import { Input } from '../components/input.component'

import { ICollision2 } from '../../../shared/interfaces/collision2.interface'
import { IOnTriggerEnter } from '../../../shared/interfaces/on-trigger-enter.interface'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
@Entity({
  order: 1,
  services: [UserService, GameService, SocketService],
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
    {
      id: '__spaceship_health__',
      class: Health,
    },
  ],
})
export class Spaceship
  extends AbstractEntity
  implements IOnAwake, IDraw, IOnLateLoop, IOnTriggerEnter, IOnDestroy
{
  private userService: UserService

  private gameService: GameService

  private socketService: SocketService

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

  private image: HTMLImageElement

  public imageSrc: string

  public isShooting = false

  public tag = Spaceship.name

  public userId = ''

  public joystickId = ''

  public health: Health

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  onAwake(): void {
    this.socketService = this.getService(SocketService)
    this.userService = this.getService(UserService)
    this.gameService = this.getService(GameService)

    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
    this.health = this.getComponent(Health)
  }

  onStart(): void {
    if (this.getComponent(Render) || this.getComponent(RenderOverflow)) {
      this.image = new Image()
      this.image.src = this.imageSrc
    }
  }

  onDestroy(): void {
    this.socketService.emit('destroy', this.id)
  }

  onTriggerEnter(collision: ICollision2): void {
    if (
      collision.entity2.tag?.includes(Bullet.name) &&
      (collision.entity2 as unknown as Bullet).userId === this.userId
    ) {
      return
    }

    if (collision.entity2.tag?.includes(Asteroid.name)) {
      const asteroid = collision.entity2 as unknown as Asteroid
      this.health.hurt(asteroid.asteroidSize + 1 * 8)
    }

    if (collision.entity2.tag?.includes(Bullet.name)) {
      this.destroy(collision.entity2)
      this.health.hurt(5)
    }

    if (collision.entity2.tag?.includes(Spaceship.name)) {
      this.health.hurt(15)
    }

    if (this.health.health <= 0 && !this.gameService.gameOver) {
      if (!this.gameService.isInLocalMPGame) {
        this.gameService.gameOver = true
      } else {
        this.socketService.emit('player-killed', {
          playerId: this.userId,
          joystickId: this.joystickId,
          score: this.userService.score,
        })
      }

      this.destroy(this)
    }
  }

  onLateLoop(): void {
    this.socketService.emit('update-slaves', {
      id: this.id,
      data: {
        position: this.transform.position,
        dimensions: this.transform.dimensions,
        rotation: this.transform.rotation,
        health: this.health.health,
        maxHealth: this.health.maxHealth,
      },
    })

    if (!this.gameService.isInLocalMPGame) {
      return
    }
  }

  public draw(): void {
    this.getContexts()[0].translate(
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

    this.getContexts()[0].rotate(this.transform.rotation)

    this.getContexts()[0].beginPath()
    this.getContexts()[0].drawImage(
      this.image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.getContexts()[0].closePath()

    this.getContexts()[0].rotate(-this.transform.rotation)
    this.getContexts()[0].translate(
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
        userId: this.userId,
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

    this.socketService.emit('instantiate', {
      id: bullet.id,
      type: Bullet.name,
      data: {
        userId: bullet.userId,
        position,
        rotation,
        velocity,
      },
    } as ISocketData)
  }
}
