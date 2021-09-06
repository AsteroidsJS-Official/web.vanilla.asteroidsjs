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

import { socket } from '../../socket'

import { Drawer } from '../../components/drawer.component'
import { RenderOverflow } from '../../components/renderers/render-overflow.component'
import { Render } from '../../components/renderers/render.component'
import { Transform } from '../../components/transform.component'

@Entity({
  components: [
    Render,
    Drawer,
    {
      id: '__asteroid_virtual_transform__',
      class: Transform,
    },
  ],
})
export class AsteroidVirtual
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw, IOnLoop
{
  private transform: Transform

  private _asteroidSize: number

  private _image = new Image()

  public set image(src: string) {
    this._image.src = src
  }

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  public onStart(): void {
    this.transform.dimensions = new Rect(
      10 * ((this._asteroidSize + 2) * 2),
      10 * ((this._asteroidSize + 2) * 2),
    )

    socket.on('update-screen', ({ id, data }: ISocketData) => {
      if (this.id !== id) {
        return
      }
      this.transform.position = data.position
      this.transform.rotation = data.rotation
    })

    socket.on('destroy', (id: string) => {
      if (id === this.id) {
        this.destroy(this)
      }
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
    this.drawAsteroid()
  }

  private drawAsteroid(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    this.game.getContext().rotate(this.transform.rotation)

    this.game.getContext().shadowColor = 'black'
    this.game.getContext().shadowBlur = 5

    this.game
      .getContext()
      .drawImage(
        this._image,
        0 - this.transform.dimensions.width / 2,
        0 - this.transform.dimensions.height / 2,
        this.transform.dimensions.width,
        this.transform.dimensions.height,
      )

    this.game.getContext().shadowColor = 'transparent'
    this.game.getContext().shadowBlur = 0

    this.game.getContext().rotate(-this.transform.rotation)
    this.game
      .getContext()
      .translate(
        -this.transform.canvasPosition.x,
        -this.transform.canvasPosition.y,
      )
  }
}
