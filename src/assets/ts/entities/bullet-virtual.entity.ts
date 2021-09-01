import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'

import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'

import { Drawer } from '../components/drawer.component'
import { Render } from '../components/render.component'
import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'

import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IBullet } from '../interfaces/bullet.interface'

@Entity({
  components: [Drawer, Transform, Rigidbody, Render],
  properties: [
    {
      for: Transform,
      use: {
        dimensions: new Rect(2, 14),
      },
    },
    {
      for: Rigidbody,
      use: {
        mass: 3,
      },
    },
  ],
})
export class BulletVirtual
  extends AbstractEntity
  implements IBullet, IDraw, IOnAwake, IOnLoop
{
  public transform: Transform
  public rigidbody: Rigidbody
  private context: CanvasRenderingContext2D

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  onAwake(): void {
    this.context = this.game.getContext()
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  draw(): void {
    this.context.translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.context.rotate(this.transform.rotation)

    this.context.shadowColor = 'yellow'
    this.context.shadowBlur = 25

    this.context.beginPath()
    this.context.fillStyle = '#ffc887'
    this.context.rect(
      0,
      0,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.context.fill()
    this.context.closePath()

    this.context.shadowColor = 'transparent'
    this.context.shadowBlur = 0

    this.context.rotate(-this.transform.rotation)
    this.context.translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  onLoop(): void {
    const hasOverflowX =
      this.transform.canvasPosition.x + this.transform.dimensions.width + 50 <
        0 ||
      this.transform.canvasPosition.x - this.transform.dimensions.width - 50 >
        this.context.canvas.width
    const hasOverflowY =
      this.transform.canvasPosition.y + this.transform.dimensions.height + 50 <
        0 ||
      this.transform.canvasPosition.y - this.transform.dimensions.height - 50 >
        this.context.canvas.height

    if (hasOverflowX || hasOverflowY) {
      this.destroy(this)
    }
  }
}
