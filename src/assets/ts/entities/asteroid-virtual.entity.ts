import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnLoop,
  IOnStart,
  ISocketData,
  isOverflowingX,
  isOverflowingY,
  Rect,
} from '@asteroidsjs'

import { socket } from '../socket'

import { RenderOverflow } from '../components/renderers/render-overflow.component'
import { Render } from '../components/renderers/render.component'
import { Transform } from '../components/transform.component'

@Entity({
  components: [Transform, Render],
})
export class AsteroidVirtual
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw, IOnLoop
{
  private transform: Transform

  private _asteroidSize: number

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  public onStart(): void {
    this.transform.dimensions = new Rect(
      15 * (this._asteroidSize + 2),
      15 * (this._asteroidSize + 2),
    )

    socket.on('update-screen', ({ id, data }: ISocketData) => {
      if (this.id !== id) {
        return
      }
      this.transform.position = data.position
      this.transform.rotation = data.rotation
    })
  }

  public onLoop(): void {
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

    if (
      !overflowingX &&
      !overflowingY &&
      this.getComponent(Render) &&
      !this.getComponent(RenderOverflow)
    ) {
      this.addComponent(RenderOverflow)
      this.destroy(this.getComponent(Render))
    }
  }

  public draw(): void {
    this.drawCircle()
  }

  private drawCircle(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )

    this.game.getContext().beginPath()
    this.game.getContext().fillStyle = '#484848'
    this.game
      .getContext()
      .arc(0, 0, this.transform.dimensions.width / 2, 0, 2 * Math.PI)
    this.game.getContext().fill()

    this.game
      .getContext()
      .translate(
        -this.transform.canvasPosition.x,
        -this.transform.canvasPosition.y,
      )
  }
}
