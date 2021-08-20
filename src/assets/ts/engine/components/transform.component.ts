import { Component } from '../core/component'
import { Vector2 } from '../core/vector2'
import { GameFactory } from '../game.factory'
import { IStart } from '../interfaces/start.interface'

export class Transform extends Component implements IStart {
  public position = new Vector2()
  public dimensions = new Vector2(100, 100)

  private context: CanvasRenderingContext2D

  public get canvasPosition(): Vector2 {
    return new Vector2(
      this.context.canvas.width / 2 + this.position.x,
      this.context.canvas.height / 2 - this.position.y,
    )
  }

  public start(): void {
    this.context = GameFactory.context
  }
}
