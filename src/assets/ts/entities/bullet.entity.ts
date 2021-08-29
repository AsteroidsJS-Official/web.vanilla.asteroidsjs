import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'
import { AbstractEntity } from '../engine/abstract-entity'
import { IOnDraw } from '../engine/interfaces/on-draw.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { IBullet } from '../interfaces/bullet.interface'

export class Bullet
  extends AbstractEntity
  implements IBullet, IOnDraw, IOnStart, IOnLoop
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

  onStart(): void {
    this.context = this.game.getContext()
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)

    this.transform.dimensions = new Rect(2, 14)
    this.rigidbody.mass = 3
  }

  onDraw(): void {
    this.context.translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.context.rotate(this.transform.rotation)

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
