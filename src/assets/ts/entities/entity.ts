import { GameFactory } from '../game'
import { ILoop } from '../interfaces/loop.interface'
import { Vector2 } from '../physics/vector2'

export abstract class Entity implements ILoop {
  private _position: Vector2

  public get position(): Vector2 {
    return this._position
  }

  public set position(vector: Vector2) {
    this._position = new Vector2(
      vector.x,
      this.context.canvas.height - vector.y,
    )
  }

  public constructor(
    protected readonly context: CanvasRenderingContext2D,
    public mass = 1,
    public dimensions = new Vector2(50, 50),
    position = new Vector2(),
    public velocity = new Vector2(),
    public resultant = new Vector2(),
  ) {
    GameFactory.registerEntity(this)
    this.position = position
  }

  public loop(): void {
    const speed = Vector2.divide(
      new Vector2(this.resultant.x, -this.resultant.y),
      this.mass,
    )

    this._position = Vector2.sum(this._position, this.velocity)
    this.velocity = Vector2.sum(this.velocity, speed)
  }

  public abstract draw(): void
}
