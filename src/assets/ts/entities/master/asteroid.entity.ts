import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnLoop,
  IOnStart,
  isOverflowingX,
  isOverflowingY,
  Rect,
} from '@asteroidsjs'

import { socket } from '../../socket'

import { Drawer } from '../../components/drawer.component'
import { RenderOverflow } from '../../components/renderers/render-overflow.component'
import { Render } from '../../components/renderers/render.component'
import { Rigidbody } from '../../components/rigidbody.component'
import { Transform } from '../../components/transform.component'

@Entity({
  components: [
    Rigidbody,
    Drawer,
    Render,
    {
      id: '__asteroid_transform__',
      class: Transform,
    },
  ],
})
export class Asteroid
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw, IOnLoop
{
  private transform: Transform

  private rigidbody: Rigidbody

  private _asteroidSize: number

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  public onStart(): void {
    this.transform.dimensions = new Rect(
      15 * (this._asteroidSize + 2),
      15 * (this._asteroidSize + 2),
    )
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

    socket.emit('update-slaves', {
      id: this.id,
      data: {
        position: this.transform.position,
        rotation: this.transform.rotation,
      },
    })
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
