import spaceshipImg from '../../svg/spaceship.svg'
import { Render } from '../engine/components/render.component'
import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { IDraw } from '../engine/interfaces/draw.interface'
import { ILoop } from '../engine/interfaces/loop.interface'
import { IStart } from '../engine/interfaces/start.interface'
import { Vector2 } from '../engine/math/vector2'
import { Bullet } from './bullet.entity'

/**
 * Class that represents the virtual spaceship entity, used for rendering
 * uncontrollable spaceships.
 */
export class SpaceshipVirtual extends Entity implements IStart, IDraw, ILoop {
  /**
   * Property that contains the spaceship position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property that contains the spaceship velocity.
   */
  private velocity: Vector2

  /**
   * Property responsible for the spaceship bullet velocity.
   */
  public readonly bulletVelocity = 10

  /**
   * Property responsible for the spaceship last bullet time.
   */
  public lastShot: Date

  /**
   * Property that indicates the direction that the spaceship is facing.
   */
  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  public isShooting = false

  public start(): void {
    this.transform = this.getComponent(Transform)
  }

  public draw(): void {
    this.drawTriangle()
  }

  private drawTriangle(): void {
    this.game.context.translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.game.context.rotate(this.transform.rotation)

    const image = new Image()
    image.src = spaceshipImg

    // TODO: apply color to SVG
    this.game.context.drawImage(
      image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )

    // this.game.context.beginPath()
    // this.game.context.fillStyle = '#ff0055'
    // this.game.context.moveTo(0, -this.transform.dimensions.height / 2)
    // this.game.context.lineTo(
    //   -this.transform.dimensions.width / 2,
    //   this.transform.dimensions.height / 2,
    // )
    // this.game.context.lineTo(
    //   this.transform.dimensions.width / 2,
    //   this.transform.dimensions.height / 2,
    // )
    // this.game.context.fill()
    // this.game.context.closePath()

    this.game.context.rotate(-this.transform.rotation)
    this.game.context.translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  public loop(): void {
    if (this.isShooting) {
      if (
        this.lastShot &&
        new Date().getTime() - this.lastShot.getTime() < 300
      ) {
        return
      }

      this.lastShot = new Date()

      const bulletLeft = this.instantiate({
        entity: Bullet,
        components: [Transform, Rigidbody, Render],
      })

      bulletLeft.transform.position = Vector2.sum(
        this.transform.position,
        Vector2.multiply(
          new Vector2(
            Math.sin(this.transform.rotation - (2 * Math.PI) / 4),
            Math.cos(this.transform.rotation - (2 * Math.PI) / 4),
          ),
          23,
        ),
      )
      bulletLeft.transform.rotation = this.transform.rotation
      bulletLeft.rigidbody.velocity = Vector2.sum(
        this.velocity,
        Vector2.multiply(this.direction, this.bulletVelocity),
      )

      const bulletRight = this.instantiate({
        entity: Bullet,
        components: [Transform, Rigidbody, Render],
      })

      bulletRight.transform.position = Vector2.sum(
        this.transform.position,
        Vector2.multiply(
          new Vector2(
            Math.sin(this.transform.rotation + (2 * Math.PI) / 4),
            Math.cos(this.transform.rotation + (2 * Math.PI) / 4),
          ),
          20,
        ),
      )
      bulletRight.transform.rotation = this.transform.rotation
      bulletRight.rigidbody.velocity = Vector2.sum(
        this.velocity,
        Vector2.multiply(this.direction, this.bulletVelocity),
      )
    }
  }
}
