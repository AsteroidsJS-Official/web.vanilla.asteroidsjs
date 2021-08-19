import { GameFactory } from '../game'
import { ILoop } from '../interfaces/loop.interface'
import { Vector2 } from '../physics/vector2'

export abstract class Entity implements ILoop {
  public constructor(
    protected readonly context: CanvasRenderingContext2D,
    public mass = 1,
    public dimensions = new Vector2(50, 50),
    public position = new Vector2(),
    public velocity = new Vector2(),
    public resultant = new Vector2(),
  ) {
    GameFactory.registerEntity(this)
  }

  public loop(): void {
    const speed = Vector2.divide(this.resultant, this.mass)

    this.position = Vector2.sum(this.position, this.velocity)
    this.velocity = Vector2.sum(this.velocity, speed)
  }

  public abstract draw(): void
}
