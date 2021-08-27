import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'
import { Entity } from '../engine/core/entity'
import { IOnDraw } from '../engine/core/interfaces/on-draw.interface'
import { IOnStart } from '../engine/core/interfaces/on-start.interface'
import { Rect } from '../engine/core/math/rect'
import { Vector2 } from '../engine/core/math/vector2'
import { ISpaceship } from '../interfaces/spaceship.interface'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
export class Spaceship extends Entity implements ISpaceship, IOnStart, IOnDraw {
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

  public onStart(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)

    this.transform.dimensions = new Rect(30, 45)
    this.rigidbody.friction = 0.005
    this.rigidbody.mass = 10
    this.rigidbody.maxAngularVelocity = 0.09
  }

  public onDraw(): void {
    this.drawTriangle()
  }

  private drawTriangle(): void {
    const displacement = -this.transform.dimensions.height / 3

    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    this.game.getContext().rotate(this.transform.rotation)

    this.game.getContext().beginPath()
    this.game.getContext().fillStyle = '#ff0055'
    this.game
      .getContext()
      .moveTo(0, -this.transform.dimensions.height / 2 + displacement)
    this.game
      .getContext()
      .lineTo(
        -this.transform.dimensions.width / 2,
        this.transform.dimensions.height / 2 + displacement,
      )
    this.game
      .getContext()
      .lineTo(
        this.transform.dimensions.width / 2,
        this.transform.dimensions.height / 2 + displacement,
      )
    this.game.getContext().closePath()
    this.game.getContext().fill()

    this.game.getContext().rotate(-this.transform.rotation)
    this.game
      .getContext()
      .translate(
        -this.transform.canvasPosition.x,
        -this.transform.canvasPosition.y,
      )
  }
}
