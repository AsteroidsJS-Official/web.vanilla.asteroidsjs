import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnLoop,
  IOnStart,
  ISocketData,
  Vector2,
} from '@asteroidsjs'

import { socket } from '../socket'

import { Bullet } from './bullet.entity'

import { Drawer } from '../components/drawer.component'
import { Health } from '../components/health.component'
import { Input } from '../components/input.component'
import { RenderOverflow } from '../components/render-overflow.component'
import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'

import { uuid } from '../../../../libs/asteroidsjs/src/utils/validations'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
@Entity({
  components: [Input, Drawer, Transform, Rigidbody, RenderOverflow, Health],
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
  implements IOnAwake, IDraw, IOnLoop, IOnStart
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

  private health: Health

  private image = new Image()

  public imageSrc = ''

  public nickname = ''

  public spaceshipColor = ''

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  onAwake(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
    this.health = this.getComponent(Health)
  }

  onStart(): void {
    this.image.src = this.imageSrc
  }

  onLoop(): void {
    this.health.heal(0.01)

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
    this.drawSpaceship()
  }

  public shoot(): void {
    if (this.lastShot && new Date().getTime() - this.lastShot.getTime() < 300) {
      return
    }

    this.lastShot = new Date()

    this.createLeftBullet()
    this.createRightBullet()
  }

  private drawSpaceship(): void {
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
