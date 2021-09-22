import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnLoop,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { Drawer } from '../../../shared/components/drawer.component'
import { Transform } from '../../../shared/components/transform.component'

@Entity({
  components: [
    Drawer,
    {
      class: Transform,
      id: '__trailing_transform__',
      use: {
        dimensions: new Rect(10, 10),
      },
    },
  ],
})
export class Trailing
  extends AbstractEntity
  implements IOnAwake, IDraw, IOnLoop
{
  private transform: Transform

  private maxPoints = 5
  private points: Vector2[] = []

  onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  onLoop(): void {
    this.points = [this.transform.canvasPosition.clone()]
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

    this.getContexts()[0].fillStyle = '#00FFFF'

    if (index < this.maxPoints - 5) {
      this.getContexts()[0].globalAlpha = 1
    } else {
      this.getContexts()[0].globalAlpha = (this.maxPoints - index) / 5
    }

    this.getContexts()[0].beginPath()
    this.getContexts()[0].arc(0, 0, this.transform.dimensions.width / 2, 0, 360)
    this.getContexts()[0].fill()
    this.getContexts()[0].closePath()

    this.getContexts()[0].rotate(-this.transform.rotation)
    this.getContexts()[0].translate(-point.x, -point.y)
  }
}
