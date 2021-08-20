import { Component } from '../core/component'
import { Vector2 } from '../core/vector2'
import { IStart } from '../interfaces/start.interface'

export class Transform extends Component implements IStart {
  public position: Vector2
  public dimensions: Vector2

  public get canvasPosition(): Vector2 {
    return new Vector2(
      this.game.context.canvas.width / 2 + this.position.x,
      this.game.context.canvas.height / 2 - this.position.y,
    )
  }

  public start(): void {
    this.position = new Vector2()
    this.dimensions = new Vector2(100, 100)
  }
}
