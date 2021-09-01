import { Transform } from '../components/transform.component'
import { AbstractEntity } from '../engine/abstract-entity'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'

export class Meteor
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw
{
  private transform: Transform

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  public onStart(): void {
    this.transform.position = new Vector2(0, 300)
    this.transform.dimensions = new Rect(75, 75)
  }

  public draw(): void {
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
