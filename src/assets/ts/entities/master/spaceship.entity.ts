import {
  AbstractEntity,
  Entity,
  generateUUID,
  IDraw,
  IOnAwake,
  IOnLateLoop,
  ISocketData,
  Vector2,
} from '@asteroidsjs'

import { socket } from '../../socket'

import { Bullet } from './bullet.entity'

import { RectCollider2 } from '../../components/colliders/rect-collider2.component'
import { Drawer } from '../../components/drawer.component'
import { Input } from '../../components/input.component'
import { RenderOverflow } from '../../components/renderers/render-overflow.component'
import { Rigidbody } from '../../components/rigidbody.component'
import { Transform } from '../../components/transform.component'

import { ICollision2 } from '../../interfaces/collision2.interface'
import { IOnTriggerEnter } from '../../interfaces/on-trigger-enter.interface'

import spaceshipImg from '../../../svg/spaceship.svg'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
@Entity({
  components: [
    Input,
    Drawer,
    Transform,
    Rigidbody,
    RenderOverflow,
    RectCollider2,
  ],
  properties: [
    {
      for: Input,
      use: {
        force: 3,
        angularForce: 0.03,
      },
    },
    {
      for: RectCollider2,
      use: {
        localPosition: new Vector2(-50, 50),
      },
    },
  ],
})
export class Spaceship
  extends AbstractEntity
  implements IOnAwake, IDraw, IOnLateLoop, IOnTriggerEnter
{
  public isShooting = false

  /**
   * Property responsible for the spaceship bullet velocity.
   */
  private readonly bulletVelocity = 10

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

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  onAwake(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  onStart(): void {
    this.image = new Image()
    this.image.src = spaceshipImg
  }

  onTriggerEnter(collision: ICollision2): void {
    if (collision.entity2.tag?.includes(Bullet.name)) {
      return
    }
    console.log('destroy')
  }

  onLateLoop(): void {
    socket.emit('update-slaves', {
      id: this.id,
      data: {
        position: this.transform.position,
        dimensions: this.transform.dimensions,
        rotation: this.transform.rotation,
      },
    })
  }

  public draw(): void {
    this.getContext().translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.getContext().rotate(this.transform.rotation)

    this.getContext().drawImage(
      this.image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )

    this.getContext().rotate(-this.transform.rotation)
    this.getContext().translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  public shoot(): void {
    if (this.lastShot && new Date().getTime() - this.lastShot.getTime() < 300) {
      return
    }

    this.lastShot = new Date()

    this.createLeftBullet()
    this.createRightBullet()
  }

  private createRightBullet(): void {
    const rightBulletId = generateUUID()
    const rotation = this.transform.rotation
    const position = Vector2.sum(
      this.transform.position,
      Vector2.multiply(
        new Vector2(
          Math.sin(this.transform.rotation + (2 * Math.PI) / 4),
          Math.cos(this.transform.rotation + (2 * Math.PI) / 4),
        ),
        this.transform.dimensions.width / 2 - 6,
      ),
    )
    const velocity = Vector2.sum(
      this.rigidbody.velocity,
      Vector2.multiply(this.direction, this.bulletVelocity),
    )

    this.instantiate({
      use: {
        tag: `${Bullet.name}|${rightBulletId}`,
      },
      entity: Bullet,
      properties: [
        {
          for: Transform,
          use: {
            position,
            rotation,
          },
        },
        {
          for: Rigidbody,
          use: {
            velocity,
          },
        },
      ],
    })

    socket.emit('instantiate', {
      id: rightBulletId,
      type: Bullet.name,
      data: {
        position,
        rotation,
        velocity,
      },
    } as ISocketData)
  }

  private createLeftBullet(): void {
    const leftBulletId = generateUUID()
    const rotation = this.transform.rotation
    const position = Vector2.sum(
      this.transform.position,
      Vector2.multiply(
        new Vector2(
          Math.sin(this.transform.rotation - (2 * Math.PI) / 4),
          Math.cos(this.transform.rotation - (2 * Math.PI) / 4),
        ),
        this.transform.dimensions.width / 2 - 4,
      ),
    )
    const velocity = Vector2.sum(
      this.rigidbody.velocity,
      Vector2.multiply(this.direction, this.bulletVelocity),
    )

    this.instantiate({
      use: {
        tag: `${Bullet.name}|${leftBulletId}`,
      },
      entity: Bullet,
      properties: [
        {
          for: Transform,
          use: {
            position,
            rotation,
          },
        },
        {
          for: Rigidbody,
          use: {
            velocity,
          },
        },
      ],
    })

    socket.emit('instantiate', {
      id: leftBulletId,
      type: Bullet.name,
      data: {
        position,
        rotation,
        velocity,
      },
    } as ISocketData)
  }
}
