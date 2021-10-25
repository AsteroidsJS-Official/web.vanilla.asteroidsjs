import {
  AbstractComponent,
  angleToVector2,
  Component,
  Rect,
  Vector2,
  vector2ToAngle,
} from '@asteroidsjs'

import { Transform } from '../transform.component'

@Component({
  order: -1,
  required: [Transform],
})
export class Trail extends AbstractComponent {
  /**
   * Property that defines the trail alpha.
   */
  alpha = 1

  /**
   * Property that defines the max generated points amount.
   */
  maxPoints = 5

  /**
   * Property that defines the trail color.
   */
  color = '#00FFFF'

  /**
   * Property that defines the trail dimensions.
   */
  dimensions = new Rect()

  /**
   * Property that represents the collider posision relative to it entity
   */
  localPosition = new Vector2()

  /**
   * Property that defines the entity {@link Transform} component.
   */
  private transform: Transform

  /**
   * Property that defines an array of points, that represent the last
   * entity positions.
   */
  private points: Vector2[] = []

  /**
   * Property that represents the collider posision relative to it entity
   */
  get position(): Vector2 {
    return Vector2.sum(
      this.transform.position,
      Vector2.multiply(
        angleToVector2(
          vector2ToAngle(this.localPosition.normalized) -
            this.transform.rotation,
        ),
        this.localPosition.magnitude,
      ),
    )
  }

  /**
   * Property that defines the entity position in html canvas
   */
  get canvasPosition(): Vector2 {
    return new Vector2(
      this.getContexts()[0].canvas.width / 2 + this.position.x,
      this.getContexts()[0].canvas.height / 2 - this.position.y,
    )
  }

  onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  onLoop(): void {
    this.points = [this.canvasPosition.clone()]
      .concat(this.points)
      .slice(0, this.maxPoints)
  }

  draw(): void {
    for (let i = 0; i < this.points.length; i++) {
      this.drawPoint(this.points[i], i)
    }
    this.getContexts()[0].globalAlpha = 1
  }

  private drawPoint(point: Vector2, index: number): void {
    this.getContexts()[0].translate(point.x, point.y)
    this.getContexts()[0].rotate(this.transform.rotation)

    this.getContexts()[0].fillStyle = this.color

    if (index < this.maxPoints) {
      this.getContexts()[0].globalAlpha = 1
    } else {
      this.getContexts()[0].globalAlpha = this.maxPoints - index
    }

    this.getContexts()[0].beginPath()
    this.getContexts()[0].arc(0, 0, this.dimensions.width / 10, 0, 360)
    this.getContexts()[0].fill()
    this.getContexts()[0].closePath()

    this.getContexts()[0].rotate(-this.transform.rotation)
    this.getContexts()[0].translate(-point.x, -point.y)
  }
}
