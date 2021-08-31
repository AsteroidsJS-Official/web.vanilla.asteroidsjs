import { ISocketData } from '../interfaces/socket-data.interface'
import { socket } from '../socket'

import { uuid } from '../engine/utils/validations'

import spaceshipImg from '../../svg/spaceship.svg'
import { Input } from '../components/input.component'
import { RenderOverflow } from '../components/render-overflow.component'
import { Render } from '../components/render.component'
import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'
import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { Vector2 } from '../engine/math/vector2'
import { ISpaceship } from '../interfaces/spaceship.interface'
import { Bullet } from './bullet.entity'
import { Child } from './child.entity'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
@Entity({
  components: [Input, Transform, Rigidbody, RenderOverflow],
})
export class Spaceship
  extends AbstractEntity
  implements ISpaceship, IOnAwake, IDraw, IOnLoop
{
  public readonly force = 3

  public readonly angularForce = 0.03

  public readonly bulletVelocity = 10

  public isShooting = false

  public lastShot: Date

  /**
   * Property that contains the spaceship position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property that contains the spaceship physics.
   */
  private rigidbody: Rigidbody

  private image: HTMLImageElement

  private children: IDraw[] = []

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

    this.children.push(
      this.instantiate({
        entity: Child,
        components: [Render],
        properties: [
          {
            for: Transform,
            use: {
              // parent: this.transform,
              localPosition: new Vector2(50, 50),
            },
          },
        ],
      }) as unknown as IDraw,
      this.instantiate({
        entity: Child,
        components: [],
        properties: [
          {
            for: Transform,
            use: {
              parent: this.transform,
              localPosition: new Vector2(-100, -100),
            },
          },
        ],
      }) as unknown as IDraw,
    )
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
    // this.drawCircle()
    this.children.forEach(
      (child) =>
        (child as unknown as AbstractEntity).getComponent(Transform).parent &&
        child.draw(),
    )
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

  private drawCircle(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    this.game.getContext().rotate(this.transform.rotation)

    this.game.getContext().beginPath()

    this.game.getContext().fillStyle = 'green'
    this.game
      .getContext()
      .arc(0, 0, this.transform.totalDimensions.width / 2, 0, 360)
    this.game.getContext().fill()
    this.game.getContext().closePath()

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

  private drawTriangle(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    this.game.getContext().rotate(this.transform.rotation)

    // TODO: apply color to SVG
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
        this.transform.dimensions.width / 2 - 2,
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
        this.transform.dimensions.width / 2,
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
