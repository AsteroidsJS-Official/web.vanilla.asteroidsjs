import { Component } from '../core/component'
import { IDraw } from '../interfaces/draw.interface'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Vector2 } from '../math/vector2'
import { Transform } from './transform.component'

export class AvoidOverflow extends Component implements IStart, ILoop {
  public drawer: IDraw
  public transform: Transform

  public start(): void {
    this.requires([Transform])

    if (this.game.hasDraw(this.entity)) {
      this.drawer = this.entity
    }

    this.transform = this.getComponent(Transform)
  }

  public loop(): void {
    this.drawer?.draw()

    if (this.isOverflowingX() && this.isOverflowingY()) {
      const overflowAmountTop =
        this.transform.canvasPosition.y - this.transform.dimensions.height / 2
      const overflowAmountLeft =
        this.transform.canvasPosition.x - this.transform.dimensions.width / 2

      const isTop = overflowAmountTop < this.transform.dimensions.height / 2
      const isLeft = overflowAmountLeft < this.transform.dimensions.width / 2

      const auxY = this.transform.position.y
      const newY = isTop
        ? this.transform.position.y - this.game.context.canvas.height
        : this.transform.position.y + this.game.context.canvas.height

      const newX = isLeft
        ? this.transform.position.x + this.game.context.canvas.width
        : this.transform.position.x - this.game.context.canvas.width

      this.transform.position = new Vector2(this.transform.position.x, newY)

      this.drawer?.draw()

      this.transform.position = new Vector2(newX, auxY)

      this.drawer?.draw()

      this.transform.position = new Vector2(this.transform.position.x, newY)

      this.drawer?.draw()
    } else if (this.isOverflowingY()) {
      const overflowAmount =
        this.transform.canvasPosition.y - this.transform.dimensions.y / 2

      const isTop = overflowAmount < this.transform.dimensions.y / 2

      this.transform.position = new Vector2(
        this.transform.position.x,
        isTop
          ? this.transform.position.y - this.game.context.canvas.height
          : this.transform.position.y + this.game.context.canvas.height,
      )

      this.drawer?.draw()
    } else if (this.isOverflowingX()) {
      const overflowAmount =
        this.transform.canvasPosition.x - this.transform.dimensions.x / 2

      const isLeft = overflowAmount < this.transform.dimensions.x / 2

      this.transform.position = new Vector2(
        isLeft
          ? this.transform.position.x + this.game.context.canvas.width
          : this.transform.position.x - this.game.context.canvas.width,
        this.transform.position.y,
      )

      this.drawer?.draw()
    }
  }

  private isOverflowingY(): boolean {
    const topEdge =
      this.game.context.canvas.height / 2 -
      this.transform.position.y -
      this.transform.dimensions.height / 2

    const bottomEdge =
      this.game.context.canvas.height / 2 -
      this.transform.position.y +
      this.transform.dimensions.height / 2

    return topEdge < 0 || bottomEdge > this.game.context.canvas.height
  }

  private isOverflowingX(): boolean {
    const leftEdge =
      this.game.context.canvas.width / 2 -
      this.transform.position.x -
      this.transform.dimensions.width / 2

    const rightEdge =
      this.game.context.canvas.width / 2 -
      this.transform.position.x +
      this.transform.dimensions.width / 2

    return leftEdge < 0 || rightEdge > this.game.context.canvas.width
  }
}
