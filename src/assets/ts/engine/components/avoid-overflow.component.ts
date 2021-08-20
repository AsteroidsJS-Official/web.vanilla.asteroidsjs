import { Component } from '../core/component'
import { Vector2 } from '../core/vector2'
import { IDraw } from '../interfaces/draw.interface'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Rigidbody } from './rigidbody.component'
import { Transform } from './transform.component'

export class AvoidOverflow extends Component implements IStart, ILoop {
  public drawer: IDraw
  public transform: Transform
  public rigidbody: Rigidbody

  public start(): void {
    this.requires([Rigidbody, Transform])

    if (this.game.hasDraw(this.entity)) {
      this.drawer = this.entity
    }

    this.rigidbody = this.getComponent(Rigidbody)
    this.transform = this.getComponent(Transform)
  }

  public loop(): void {
    this.drawer?.draw()

    if (this.isOverflowingY()) {
      const overflowAmount =
        this.transform.canvasPosition.y - this.transform.dimensions.y / 2

      const isTop = overflowAmount < this.transform.dimensions.y / 2

      if (isTop) {
        this.transform.position = new Vector2(
          this.transform.position.x,
          this.transform.position.y - this.game.context.canvas.height,
        )
      } else {
        this.transform.position = new Vector2(
          this.transform.position.x,
          this.transform.position.y + this.game.context.canvas.height,
        )
      }

      this.drawer?.draw()
    } else if (this.isOverflowingX()) {
      const overflowAmount =
        this.transform.canvasPosition.x - this.transform.dimensions.x / 2

      const isLeft = overflowAmount < this.transform.dimensions.x / 2

      if (isLeft) {
        this.transform.position = new Vector2(
          this.transform.position.x + this.game.context.canvas.width,
          this.transform.position.y,
        )
      } else {
        this.transform.position = new Vector2(
          this.transform.position.x - this.game.context.canvas.width,
          this.transform.position.y,
        )
      }

      this.drawer?.draw()
    }
  }

  private isOverflowingY(): boolean {
    const topEdge =
      this.game.context.canvas.height / 2 -
      this.transform.position.y -
      this.transform.dimensions.y / 2

    const bottomEdge =
      this.game.context.canvas.height / 2 -
      this.transform.position.y +
      this.transform.dimensions.y / 2

    return topEdge < 0 || bottomEdge > this.game.context.canvas.height
  }

  private isOverflowingX(): boolean {
    const leftEdge =
      this.game.context.canvas.width / 2 -
      this.transform.position.x -
      this.transform.dimensions.x / 2

    const rightEdge =
      this.game.context.canvas.width / 2 -
      this.transform.position.x +
      this.transform.dimensions.x / 2

    return leftEdge < 0 || rightEdge > this.game.context.canvas.width
  }
}
