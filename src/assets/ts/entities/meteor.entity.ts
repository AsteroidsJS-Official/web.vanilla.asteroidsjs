import { Transform } from '../components/transform.component'
import { Entity } from '../engine/core/entity'
import { IOnDraw } from '../engine/core/interfaces/on-draw.interface'
import { IOnStart } from '../engine/core/interfaces/on-start.interface'
import { Rect } from '../engine/core/math/rect'
import { Vector2 } from '../engine/core/math/vector2'

export class Meteor extends Entity implements IOnDraw, IOnStart {
  private transform: Transform

  public onStart(): void {
    this.transform = this.getComponent(Transform)

    this.transform.position = new Vector2(0, 300)
    this.transform.dimensions = new Rect(75, 75)
  }

  public onDraw(): void {
    this.drawCircle()
  }

  private drawCircle(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )

    this.game.getContext().beginPath()
    this.game.getContext().fillStyle = '#484848'
    this.game
      .getContext()
      .arc(0, 0, this.transform.dimensions.width / 2, 0, 2 * Math.PI)
    this.game.getContext().fill()

    this.game
      .getContext()
      .translate(
        -this.transform.canvasPosition.x,
        -this.transform.canvasPosition.y,
      )
  }
}
