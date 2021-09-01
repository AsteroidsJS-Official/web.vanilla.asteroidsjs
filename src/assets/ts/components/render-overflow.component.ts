import { isOverflowingX, isOverflowingY } from '../engine/utils/overflow'
import { hasDraw } from '../engine/utils/validations'

import { AbstractComponent } from '../engine/abstract-component'
import { Component } from '../engine/decorators/component.decorator'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Vector2 } from '../engine/math/vector2'
import { Transform } from './transform.component'

/**
 * Class that represents the component responsible for rendering the
 * entity across the screen when it's positioned at any edge of the
 * canvas
 */
@Component({
  required: [Transform],
})
export class RenderOverflow
  extends AbstractComponent
  implements IOnStart, IOnLoop
{
  public drawer: IDraw
  public transform: Transform

  public onStart(): void {
    if (!hasDraw(this.entity)) {
      throw new Error(
        `${this.entity.constructor.name} has a ${this.constructor.name} but not implements the IDraw interface`,
      )
    }

    this.drawer = this.entity
    this.transform = this.getComponent(Transform)
  }

  public onLoop(): void {
    this.drawer?.draw()

    const overflowingX = isOverflowingX(
      this.game.getContext().canvas.width,
      this.transform.position.x,
      this.transform.totalDimensions.width,
    )
    const overflowingY = isOverflowingY(
      this.game.getContext().canvas.height,
      this.transform.position.y,
      this.transform.totalDimensions.height,
    )

    if (overflowingX && overflowingY) {
      const overflowAmountTop =
        this.transform.canvasPosition.y -
        this.transform.totalDimensions.height / 2
      const overflowAmountLeft =
        this.transform.canvasPosition.x -
        this.transform.totalDimensions.width / 2

      const isTop =
        overflowAmountTop < this.transform.totalDimensions.height / 2
      const isLeft =
        overflowAmountLeft < this.transform.totalDimensions.width / 2

      const auxY = this.transform.position.y
      const newY = isTop
        ? this.transform.position.y - this.game.getContext().canvas.height
        : this.transform.position.y + this.game.getContext().canvas.height

      const newX = isLeft
        ? this.transform.position.x + this.game.getContext().canvas.width
        : this.transform.position.x - this.game.getContext().canvas.width

      this.transform.position = new Vector2(this.transform.position.x, newY)

      this.drawer?.draw()

      this.transform.position = new Vector2(newX, auxY)

      this.drawer?.draw()

      this.transform.position = new Vector2(this.transform.position.x, newY)

      this.drawer?.draw()
    } else if (overflowingY) {
      const overflowAmount =
        this.transform.canvasPosition.y -
        this.transform.totalDimensions.height / 2

      const isTop = overflowAmount < this.transform.totalDimensions.height / 2

      this.transform.position = new Vector2(
        this.transform.position.x,
        isTop
          ? this.transform.position.y - this.game.getContext().canvas.height
          : this.transform.position.y + this.game.getContext().canvas.height,
      )

      this.drawer?.draw()
    } else if (overflowingX) {
      const overflowAmount =
        this.transform.canvasPosition.x -
        this.transform.totalDimensions.width / 2

      const isLeft = overflowAmount < this.transform.totalDimensions.width / 2

      this.transform.position = new Vector2(
        isLeft
          ? this.transform.position.x + this.game.getContext().canvas.width
          : this.transform.position.x - this.game.getContext().canvas.width,
        this.transform.position.y,
      )

      this.drawer?.draw()
    }
  }
}
