import { ISocketData } from '../interfaces/socket-data.interface'
import { socket } from '../socket'

import { Vector2 } from '../engine/math/vector2'

import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { Bullet } from './bullet.entity'

import { Drawer } from '../components/drawer.component'
import { Input } from '../components/input.component'
import { RenderOverflow } from '../components/render-overflow.component'
import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'

import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'

import { uuid } from '../engine/utils/validations'

import spaceshipImg from '../../svg/spaceship.svg'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
@Entity({
  components: [Input, Drawer, Transform, Rigidbody, RenderOverflow],
  properties: [
    {
      for: Input,
      use: {
        force: 3,
        angularForce: 0.03,
      },
    },
  ],
})
export class Spaceship
  extends AbstractEntity
  implements IOnAwake, IDraw, IOnLoop
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

  onLoop(): void {
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
    this.drawTriangle()
  }

  public shoot(): void {
    if (this.lastShot && new Date().getTime() - this.lastShot.getTime() < 300) {
      return
    }

    this.lastShot = new Date()

    this.createLeftBullet()
    this.createRightBullet()
  }

  private drawTriangle(): void {
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

  private createRightBullet(): void {
    const rightBulletId = uuid()
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
    const leftBulletId = uuid()
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
