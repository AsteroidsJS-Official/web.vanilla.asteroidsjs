import {
  AbstractComponent,
  Component,
  IOnAwake,
  IOnLateLoop,
  Vector2,
  isOverflowingX,
  isOverflowingY,
} from '@asteroidsjs'

import { Drawer } from '../drawer.component'
import { Transform } from '../transform.component'

/**
 * Class that represents the component responsible for rendering the
 * entity across the screen when it's positioned at any edge of the
 * canvas
 */
@Component({
  required: [Transform, Drawer],
})
export class RenderOverflow
  extends AbstractComponent
  implements IOnAwake, IOnLateLoop
{
  public drawer: Drawer
  public transform: Transform

  public onAwake(): void {
    this.drawer = this.getComponent(Drawer)
    this.transform = this.getComponent(Transform)
  }

  public onLateLoop(): void {
    this.drawer.draw()

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

      this.drawer.draw()

      this.transform.position = new Vector2(newX, auxY)

      this.drawer.draw()

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

      this.drawer.draw()
    }
  }
}
