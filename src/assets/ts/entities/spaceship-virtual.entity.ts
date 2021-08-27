import { Transform } from '../components/transform.component'
import { Entity } from '../engine/entity'
import { IOnDraw } from '../engine/interfaces/on-draw.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Vector2 } from '../engine/math/vector2'

/**
 * Class that represents the virtual spaceship entity, used for rendering
 * uncontrollable spaceships.
 */
export class SpaceshipVirtual extends Entity implements IOnStart, IOnDraw {
  /**
   * Property that contains the spaceship position, dimensions and rotation.
   */
  private transform: Transform

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
  }

  public onDraw(): void {
    this.drawTriangle()
  }

  private drawTriangle(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    this.game.getContext().rotate(this.transform.rotation)

    this.game.getContext().beginPath()
    this.game.getContext().fillStyle = '#ff0055'
    this.game.getContext().moveTo(0, -this.transform.dimensions.height / 2)
    this.game
      .getContext()
      .lineTo(
        -this.transform.dimensions.width / 2,
        this.transform.dimensions.height / 2,
      )
    this.game
      .getContext()
      .lineTo(
        this.transform.dimensions.width / 2,
        this.transform.dimensions.height / 2,
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
