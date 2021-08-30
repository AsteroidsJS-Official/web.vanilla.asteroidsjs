import { AbstractComponent } from '../engine/abstract-component'
import { Component } from '../engine/decorators/component.decorator'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'

/**
 * Component that adds soma spacial behaviours such as position and rotation
 */
@Component()
export class Transform extends AbstractComponent {
  /**
   * Property that defines the entity dimensions such as width and height
   */
  public dimensions = new Rect(100, 100)

  public localPosition = new Vector2()

  public parent: Transform

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
    if (!this.parent) {
      return this._rotation
    }
    return this.parent.rotation + this._rotation
  }

  /**
   * Property that defines the entity rotation in radians
   */
  public set rotation(value: number) {
    if (!this.parent) {
      this._rotation = value
      return
    }
    this._rotation = this.parent.rotation + value
  }

  /**
   * Property that defines the entity position
   */
  public get position(): Vector2 {
    if (!this.parent) {
      return this._position
    }
    return Vector2.sum(this.parent.position, this.localPosition)
  }

  /**
   * Property that defines the entity position
   */
  public set position(value: Vector2) {
    if (!this.parent) {
      this._position = value
      return
    }
    this.localPosition = Vector2.sum(
      value,
      Vector2.multiply(this.parent.position, -1),
    )
  }

  /**
   * Property that defines the entity position in html canvas
   */
  public get canvasPosition(): Vector2 {
    return new Vector2(
      this.game.getContext().canvas.width / 2 + this.position.x,
      this.game.getContext().canvas.height / 2 - this.position.y,
    )
  }
}
