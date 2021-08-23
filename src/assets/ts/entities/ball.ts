import { Vector2 } from '../physics/vector2'
import { Entity } from './entity'

export class Ball extends Entity {
  public constructor(
    context: CanvasRenderingContext2D,
    mass?: number,
    dimensions?: Vector2,
    position?: Vector2,
    velocity?: Vector2,
    resultant?: Vector2,
  ) {
    super(context, mass, dimensions, position, velocity, resultant)
  }

  public draw(): void {
    this.context.beginPath()
    this.context.fillStyle = '#ff0055'
    this.context.arc(
      this.position.x,
      this.position.y,
      this.dimensions.x / 2,
      0,
      2 * Math.PI,
    )
    this.context.fill()
  }
}
