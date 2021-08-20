import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IStart } from '../engine/interfaces/start.interface'

export class Spaceship extends Entity implements IStart, IDraw {
  private transform: Transform

  public start(): void {
    this.transform = this.getComponent(Transform)
  }

  public draw(): void {
    this.game.context.beginPath()
    this.game.context.fillStyle = '#ff0055'

    this.game.context.arc(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
      this.transform.dimensions.x / 2,
      0,
      2 * Math.PI,
    )
    this.game.context.fill()
  }
}
