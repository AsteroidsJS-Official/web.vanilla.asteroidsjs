import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IStart } from '../engine/interfaces/start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'

export class Meteor extends Entity implements IDraw, IStart {
  private transform: Transform

  public start(): void {
    this.transform = this.getComponent(Transform)

    this.transform.position = new Vector2(0, 300)
    this.transform.dimensions = new Rect(75, 75)
  }

  public draw(): void {
    this.drawCircle()
  }

  private drawCircle(): void {
    this.game.context.translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )

    this.game.context.beginPath()
    this.game.context.fillStyle = '#484848'
    this.game.context.arc(
      0,
      0,
      this.transform.dimensions.width / 2,
      0,
      2 * Math.PI,
    )
    this.game.context.fill()

    this.game.context.translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
