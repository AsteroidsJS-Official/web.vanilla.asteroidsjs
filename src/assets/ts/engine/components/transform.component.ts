import { Component } from '../core/component'
import { Rect } from '../math/rect'
import { Vector2 } from '../math/vector2'

/**
 * Component that adds soma spacial behaviours such as position and rotation
 */
export class Transform extends Component {
  /**
   * Property that defines the entity dimensions such as width and height
   */
  public dimensions = new Rect(100, 100)

  /**
   * Property that defines the entity rotation in radians
   */
  private _rotation = 0

  /**
   * Property that defines the entity position
   */
  private _position = new Vector2()

  /**
   * Property that defines the entity rotation in radians
   */
  public get rotation(): number {
    return this._rotation
  }

  /**
   * Property that defines the entity rotation in radians
   */
  public set rotation(value: number) {
    this._rotation = value
  }

  /**
   * Property that defines the entity rotation in degrees
   */
  public get euler(): number {
    return (this._rotation * 180) / Math.PI
  }

  /**
   * Property that defines the entity rotation in degrees
   */
  public set euler(value: number) {
    this._rotation = (value * Math.PI) / 180
  }

  /**
   * Property that defines the entity position
   */
  public get position(): Vector2 {
    return this._position
  }

  /**
   * Property that defines the entity position
   */
  public set position(value: Vector2) {
    this._position = value
  }

  /**
   * Property that defines the entity position in html canvas
   */
  public get canvasPosition(): Vector2 {
    return new Vector2(
      this.game.context.canvas.width / 2 + this._position.x,
      this.game.context.canvas.height / 2 - this._position.y,
    )
  }

  /**
   * Property that defines the entity position in html canvas
   */
  public set canvasPosition(value: Vector2) {
    this._position = new Vector2(
      this.game.context.canvas.width / 2 - value.x,
      this.game.context.canvas.height / 2 - value.y,
    )
  }
}
