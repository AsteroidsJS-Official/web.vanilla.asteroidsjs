import { AbstractComponent, Component, Rect, Vector2 } from '@asteroidsjs'

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

  public children: Transform[] = []

  /**
   * Property that defines the entity rotation in radians
   */
  private _rotation = 0

  /**
   * Property that defines the entity position
   */
  private _position = new Vector2()

  /**
   * Property that defines an object that represents the parent transform
   */
  private _parent: Transform

  /**
   * Property that defines an object that represents the parent transform
   */
  public get parent(): Transform {
    return this._parent
  }

  /**
   * Property that defines an object that represents the parent transform
   */
  public set parent(value: Transform) {
    value.children.push(this)
    this._parent = value
  }

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

  public get totalDimensions(): Rect {
    if (!this.children.length) {
      return this.dimensions
    }

    const childWithMaxDistance = this.children.reduce((previous, current) =>
      current.localPosition.magnitude > previous.localPosition.magnitude
        ? current
        : previous,
    )

    const maxHalfOfDimension =
      childWithMaxDistance.dimensions.height >
      childWithMaxDistance.dimensions.width
        ? childWithMaxDistance.dimensions.height / 2
        : childWithMaxDistance.dimensions.width / 2

    return new Rect(
      2 * (childWithMaxDistance.localPosition.magnitude + maxHalfOfDimension),
      2 * (childWithMaxDistance.localPosition.magnitude + maxHalfOfDimension),
    )
  }
}
