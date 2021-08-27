import { hasDraw } from '../engine/utils/validations'

import { Component } from '../engine/component'
import { IOnDraw } from '../engine/interfaces/on-draw.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Vector2 } from '../engine/math/vector2'
import { Transform } from './transform.component'

/**
 * Class that represents the component responsible for rendering the
 * entity across the screen when it's positioned at any edge of the
 * canvas
 */
export class RenderOverflow extends Component implements IOnStart, IOnLoop {
  public drawer: IOnDraw
  public transform: Transform

  public onStart(): void {
    this.requires([Transform])

    if (!hasDraw(this.entity)) {
      throw new Error(
        `${this.entity.constructor.name} has a ${this.constructor.name} but not implements the IDraw interface`,
      )
    }

    this.drawer = this.entity
    this.transform = this.getComponent(Transform)
  }

  public onLoop(): void {
    this.drawer?.onDraw()

    if (this.isOverflowingX() && this.isOverflowingY()) {
      const overflowAmountTop =
        this.transform.canvasPosition.y - this.transform.dimensions.height / 2
      const overflowAmountLeft =
        this.transform.canvasPosition.x - this.transform.dimensions.width / 2

      const isTop = overflowAmountTop < this.transform.dimensions.height / 2
      const isLeft = overflowAmountLeft < this.transform.dimensions.width / 2

      const auxY = this.transform.position.y
      const newY = isTop
        ? this.transform.position.y - this.game.getContext().canvas.height
        : this.transform.position.y + this.game.getContext().canvas.height

      const newX = isLeft
        ? this.transform.position.x + this.game.getContext().canvas.width
        : this.transform.position.x - this.game.getContext().canvas.width

      this.transform.position = new Vector2(this.transform.position.x, newY)

      this.drawer?.onDraw()

      this.transform.position = new Vector2(newX, auxY)

      this.drawer?.onDraw()

      this.transform.position = new Vector2(this.transform.position.x, newY)

      this.drawer?.onDraw()
    } else if (this.isOverflowingY()) {
      const overflowAmount =
        this.transform.canvasPosition.y - this.transform.dimensions.height / 2

      const isTop = overflowAmount < this.transform.dimensions.height / 2

      this.transform.position = new Vector2(
        this.transform.position.x,
        isTop
          ? this.transform.position.y - this.game.getContext().canvas.height
          : this.transform.position.y + this.game.getContext().canvas.height,
      )

      this.drawer?.onDraw()
    } else if (this.isOverflowingX()) {
      const overflowAmount =
        this.transform.canvasPosition.x - this.transform.dimensions.width / 2

      const isLeft = overflowAmount < this.transform.dimensions.width / 2

      this.transform.position = new Vector2(
        isLeft
          ? this.transform.position.x + this.game.getContext().canvas.width
          : this.transform.position.x - this.game.getContext().canvas.width,
        this.transform.position.y,
      )

      this.drawer?.onDraw()
    }
  }

  /**
   * Calculates if the entity is overflowing the canvas vertically.
   *
   * @returns Whether the entity is overflowing the canvas vertically.
   */
  private isOverflowingY(): boolean {
    const topEdge =
      this.game.getContext().canvas.height / 2 -
      this.transform.position.y -
      this.transform.dimensions.height / 2

    const bottomEdge =
      this.game.getContext().canvas.height / 2 -
      this.transform.position.y +
      this.transform.dimensions.height / 2

    return topEdge < 0 || bottomEdge > this.game.getContext().canvas.height
  }

  /**
   * Calculates if the entity is overflowing the canvas horizontally.
   *
   * @returns Whether the entity is overflowing the canvas horizontally.
   */
  private isOverflowingX(): boolean {
    const leftEdge =
      this.game.getContext().canvas.width / 2 -
      this.transform.position.x -
      this.transform.dimensions.width / 2

    const rightEdge =
      this.game.getContext().canvas.width / 2 -
      this.transform.position.x +
      this.transform.dimensions.width / 2

    return leftEdge < 0 || rightEdge > this.game.getContext().canvas.width
  }
}
