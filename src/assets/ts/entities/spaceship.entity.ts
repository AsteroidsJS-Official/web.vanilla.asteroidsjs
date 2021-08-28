import spaceshipImg from '../../svg/spaceship.svg'
import { Render } from '../engine/components/render.component'
import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IStart } from '../engine/interfaces/start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { ISpaceship } from '../interfaces/spaceship.interface'
import { Bullet } from './bullet.entity'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
export class Spaceship extends Entity implements ISpaceship, IStart, IDraw {
  /**
   * Property that contains the spaceship position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property that contains the spaceship physics.
   */
  private rigidbody: Rigidbody

  public readonly force = 3

  public readonly angularForce = 0.03

  public readonly bulletVelocity = 10

  public isShooting = false

  public lastShot: Date

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  public start(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)

    this.transform.dimensions = new Rect(50, 50)
    this.rigidbody.friction = 0.005
    this.rigidbody.mass = 10
    this.rigidbody.maxAngularVelocity = 0.09
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

  public shoot(): void {
    if (this.lastShot && new Date().getTime() - this.lastShot.getTime() < 300) {
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
        24,
      ),
    )
    bulletLeft.transform.rotation = this.transform.rotation
    bulletLeft.rigidbody.velocity = Vector2.sum(
      this.rigidbody.velocity,
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
        22,
      ),
    )
    bulletRight.transform.rotation = this.transform.rotation
    bulletRight.rigidbody.velocity = Vector2.sum(
      this.rigidbody.velocity,
      Vector2.multiply(this.direction, this.bulletVelocity),
    )
  }
}
