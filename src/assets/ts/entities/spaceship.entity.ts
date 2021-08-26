import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IStart } from '../engine/interfaces/start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { ISpaceship } from '../interfaces/spaceship.interface'

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

  /**
   * Property responsible for the spaceship acceleration force.
   */
  public readonly force = 3

  /**
   * Property responsible for the spaceship rotation force.
   */
  public readonly angularForce = 0.03

  /**
   * Property that indicates the direction that the spaceship is facing.
   */
  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  public start(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)

    this.transform.dimensions = new Rect(30, 45)
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

    this.game.context.beginPath()
    this.game.context.fillStyle = '#ff0055'
    this.game.context.moveTo(0, -this.transform.dimensions.height / 2)
    this.game.context.lineTo(
      -this.transform.dimensions.width / 2,
      this.transform.dimensions.height / 2,
    )
    this.game.context.lineTo(
      this.transform.dimensions.width / 2,
      this.transform.dimensions.height / 2,
    )
    this.game.context.closePath()
    this.game.context.fill()

    this.game.context.rotate(-this.transform.rotation)
    this.game.context.translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
