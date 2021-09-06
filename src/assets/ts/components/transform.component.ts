import { AbstractComponent, Component, Rect, Vector2 } from '@asteroidsjs'

import { Asteroid } from '../entities/master/asteroid.entity'

/**
 * Component that adds soma spacial behaviours such as position and rotation
 */
@Component()
export class Transform extends AbstractComponent {
  /**
   * Property that defines the entity dimensions such as width and height
   */
  dimensions = new Rect(100, 100)

  /**
   * Property that defines the child position relative to it parent
   */
  localPosition = new Vector2()

  /**
   * Property that defines an array of transforms that are this transform
   * children
   */
  children: Transform[] = []

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
  get parent(): Transform {
    return this._parent
  }

  /**
   * Property that defines an object that represents the parent transform
   */
  set parent(value: Transform) {
    value.children.push(this)
    this._parent = value
  }

  /**
   * Property that defines the entity rotation in radians
   */
  get rotation(): number {
    if (!this.parent) {
      return this._rotation
    }
    return this.parent.rotation + this._rotation
  }

  /**
   * Property that defines the entity rotation in radians
   */
  set rotation(value: number) {
    if (!this.parent) {
      this._rotation = value
      return
    }
    this._rotation = this.parent.rotation + value
  }

  /**
   * Property that defines the entity position
   */
  get position(): Vector2 {
    if (!this.parent) {
      return this._position
    }
    return Vector2.sum(this.parent.position, this.localPosition)
  }

  /**
   * Property that defines the entity position
   */
  set position(value: Vector2) {
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
  get canvasPosition(): Vector2 {
    return new Vector2(
      this.getContext().canvas.width / 2 + this.position.x,
      this.getContext().canvas.height / 2 - this.position.y,
    )
  }

  /**
   * Property that defines the sum of all the children dimensions
   */
  get totalDimensions(): Rect {
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
