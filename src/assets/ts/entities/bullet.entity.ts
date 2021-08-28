import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { IDraw } from '../engine/interfaces/draw.interface'
import { ILoop } from '../engine/interfaces/loop.interface'
import { IStart } from '../engine/interfaces/start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { IBullet } from '../interfaces/bullet.interface'

export class Bullet extends Entity implements IBullet, IDraw, IStart, ILoop {
  public transform: Transform

  public rigidbody: Rigidbody

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  start(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)

    this.transform.dimensions = new Rect(2, 14)
    this.rigidbody.mass = 3
  }

  draw(): void {
    this.game.context.translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.game.context.rotate(this.transform.rotation)

    this.game.context.beginPath()
    this.game.context.fillStyle = '#ffc887'
    this.game.context.rect(
      0,
      0,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.game.context.fill()
    this.game.context.closePath()

    this.game.context.rotate(-this.transform.rotation)
    this.game.context.translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  loop(): void {
    const hasOverflowX =
      this.transform.canvasPosition.x + this.transform.dimensions.width + 50 <
        0 ||
      this.transform.canvasPosition.x - this.transform.dimensions.width - 50 >
        this.game.context.canvas.width
    const hasOverflowY =
      this.transform.canvasPosition.y + this.transform.dimensions.height + 50 <
        0 ||
      this.transform.canvasPosition.y - this.transform.dimensions.height - 50 >
        this.game.context.canvas.height

    if (hasOverflowX || hasOverflowY) {
      this.destroy(this)
    }
  }
}
