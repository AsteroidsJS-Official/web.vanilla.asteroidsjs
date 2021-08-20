import { Component } from '../core/component'
import { Vector2 } from '../core/vector2'
import { GameFactory } from '../game.factory'
import { IDraw } from '../interfaces/draw.interface'
import { IStart } from '../interfaces/start.interface'
import { Transform } from './transform.component'

export class Image extends Component implements IDraw, IStart {
  private context: CanvasRenderingContext2D
  private transform: Transform

  public start(): void {
    this.context = GameFactory.context
    this.transform = this.getComponent(Transform)
  }

  public draw(position?: Vector2): void {
    this.context.beginPath()
    this.context.fillStyle = '#ff0055'

    position ??= this.transform.canvasPosition

    this.context.arc(
      position.x,
      position.y,
      this.transform.dimensions.x / 2,
      0,
      2 * Math.PI,
    )
    this.context.fill()
  }
}
