import { Component } from '../core/component'
import { Vector2 } from '../core/vector2'

export class Transform extends Component {
  public position: Vector2 = new Vector2()
  public dimensions: Vector2 = new Vector2(100, 100)

  public get canvasPosition(): Vector2 {
    return new Vector2(
      this.game.context.canvas.width / 2 + this.position.x,
      this.game.context.canvas.height / 2 - this.position.y,
    )
  }
}
