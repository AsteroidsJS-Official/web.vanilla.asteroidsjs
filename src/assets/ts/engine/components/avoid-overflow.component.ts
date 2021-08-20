import { Component } from '../core/component'
import { Vector2 } from '../core/vector2'
import { GameFactory } from '../game.factory'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Image } from './image.component'
import { Rigidbody } from './rigidbody.component'
import { Transform } from './transform.component'

export class AvoidOverflow extends Component implements IStart, ILoop {
  public image: Image
  public transform: Transform
  public rigidbody: Rigidbody

  private context: CanvasRenderingContext2D

  start(): void {
    this.requires([Image, Rigidbody, Transform])

    this.context = GameFactory.context
    this.image = this.getComponent(Image)
    this.rigidbody = this.getComponent(Rigidbody)
    this.transform = this.getComponent(Transform)
  }

  public loop(): void {
    this.image.draw()

    if (this.isOverflowingY()) {
      const overflowAmount =
        this.transform.canvasPosition.y - this.transform.dimensions.y / 2

      const isTop = overflowAmount < this.transform.dimensions.y / 2

      if (isTop) {
        this.transform.position = new Vector2(
          this.transform.position.x,
          this.transform.position.y - this.context.canvas.height,
        )
      } else {
        this.transform.position = new Vector2(
          this.transform.position.x,
          this.transform.position.y + this.context.canvas.height,
        )
      }

      this.image.draw()
    } else if (this.isOverflowingX()) {
      const overflowAmount =
        this.transform.canvasPosition.x - this.transform.dimensions.x / 2

      const isLeft = overflowAmount < this.transform.dimensions.x / 2

      if (isLeft) {
        this.transform.position = new Vector2(
          this.transform.position.x + this.context.canvas.width,
          this.transform.position.y,
        )
      } else {
        this.transform.position = new Vector2(
          this.transform.position.x - this.context.canvas.width,
          this.transform.position.y,
        )
      }

      this.image.draw()
    }
  }

  private isOverflowingY(): boolean {
    const topEdge =
      this.context.canvas.height / 2 -
      this.transform.position.y -
      this.transform.dimensions.y / 2

    const bottomEdge =
      this.context.canvas.height / 2 -
      this.transform.position.y +
      this.transform.dimensions.y / 2

    return topEdge < 0 || bottomEdge > this.context.canvas.height
  }

  private isOverflowingX(): boolean {
    const leftEdge =
      this.context.canvas.width / 2 -
      this.transform.position.x -
      this.transform.dimensions.x / 2

    const rightEdge =
      this.context.canvas.width / 2 -
      this.transform.position.x +
      this.transform.dimensions.x / 2

    return leftEdge < 0 || rightEdge > this.context.canvas.width
  }
}
