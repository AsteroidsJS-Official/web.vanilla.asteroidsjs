import { GameFactory } from '../game'
import { ILoop } from '../interfaces/loop.interface'
import { Vector2 } from '../physics/vector2'

export abstract class Entity implements ILoop {
  private _position: Vector2
  private isOverflowingX = false
  private isOverflowingY = false

  public get position(): Vector2 {
    return this._position
  }

  public set position(vector: Vector2) {
    this._position = new Vector2(
      this.context.canvas.width / 2 + vector.x,
      this.context.canvas.height / 2 - vector.y,
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

  public abstract draw(): void

  public loop(): void {
    const speed = Vector2.divide(
      new Vector2(this.resultant.x, this.resultant.y),
      this.mass,
    )

    this._position = Vector2.sum(
      this._position,
      new Vector2(this.velocity.x, -this.velocity.y),
    )
    this.velocity = Vector2.sum(this.velocity, speed)

    this.draw()

    const overflowLeftAmount = this.overflowX()
    const overflowTopAmount = this.overflowY()

    if (this.isOverflowingX && this.isOverflowingY) {
      const isTop = overflowTopAmount < this.dimensions.y / 2
      const auxY = this.position.y

      this.position.y += isTop
        ? this.context.canvas.height
        : -this.context.canvas.height
      this.draw()

      this.position.y = auxY
      const isLeft = overflowLeftAmount < this.dimensions.x / 2
      this.position.x += isLeft
        ? this.context.canvas.width
        : -this.context.canvas.width

      this.draw()

      this.position.y += isTop
        ? this.context.canvas.height
        : -this.context.canvas.height
      this.draw()
    } else if (this.isOverflowingY) {
      const isTop = overflowTopAmount < this.dimensions.y / 2

      this.position.y += isTop
        ? this.context.canvas.height
        : -this.context.canvas.height

      this.draw()
    } else if (this.isOverflowingX) {
      const isLeft = overflowLeftAmount < this.dimensions.x / 2

      this.position.x += isLeft
        ? this.context.canvas.width
        : -this.context.canvas.width

      this.draw()
    }
  }

  private overflowY(): number {
    const topEdge = this.position.y - this.dimensions.y / 2
    const bottomEdge = this.position.y + this.dimensions.y / 2
    this.isOverflowingY = topEdge < 0 || bottomEdge > this.context.canvas.height
    return topEdge
  }

  private overflowX(): number {
    const leftEdge = this.position.x - this.dimensions.x / 2
    const rightEdge = this.position.x + this.dimensions.x / 2
    this.isOverflowingX = leftEdge < 0 || rightEdge > this.context.canvas.width
    return leftEdge
  }
}
