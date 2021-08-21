import { Component } from '../core/component'
import { Vector2 } from '../math/vector2'

export class Transform extends Component {
  public dimensions: Vector2 = new Vector2(100, 100)

  private _rotation = 0
  private _position = new Vector2()

  public get rotation(): number {
    return this._rotation
  }

  public set rotation(value: number) {
    this._rotation = value
  }

  public get euler(): number {
    return (this._rotation * 180) / Math.PI
  }

  public set euler(value: number) {
    this._rotation = (value * Math.PI) / 180
  }

  public get position(): Vector2 {
    return this._position
  }

  public set position(value: Vector2) {
    this._position = value
  }

  public get canvasPosition(): Vector2 {
    return new Vector2(
      this.game.context.canvas.width / 2 + this._position.x,
      this.game.context.canvas.height / 2 - this._position.y,
    )
  }

  public set canvasPosition(value: Vector2) {
    this._position = new Vector2(
      this.game.context.canvas.width / 2 - value.x,
      this.game.context.canvas.height / 2 - value.y,
    )
  }
}
