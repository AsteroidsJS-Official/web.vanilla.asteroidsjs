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

import { LGSocketService } from '../../services/lg-socket.service'

import { Drawer } from '../../components/drawer.component'
import { Health } from '../../components/health.component'
import { RenderOverflow } from '../../components/renderers/render-overflow.component'
import { Render } from '../../components/renderers/render.component'
import { Rigidbody } from '../../components/rigidbody.component'
import { Transform } from '../../components/transform.component'

@Entity({
  services: [LGSocketService],
  components: [
    Render,
    Drawer,
    {
      id: '__asteroid_virtual_transform__',
      class: Transform,
    },
    {
      id: '__asteroid_virtual_rigidbody__',
      class: Rigidbody,
    },
    {
      id: '__asteroid_virtual_health__',
      class: Health,
    },
  ],
})
export class AsteroidVirtual
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw, IOnLoop
{
  private lgSocketService: LGSocketService

  private transform: Transform

  private _asteroidSize: number

  private _image: HTMLImageElement

  public health: Health

  public isFragment = false

  public set image(src: string) {
    if (this.getComponent(Render) || this.getComponent(RenderOverflow)) {
      this._image = new Image()
      this._image.src = src
    }
  }

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
    this.transform = this.getComponent(Transform)
    this.health = this.getComponent(Health)
  }

  public onStart(): void {
    this.transform.dimensions = new Rect(
      10 * ((this._asteroidSize + 2) * 2),
      10 * ((this._asteroidSize + 2) * 2),
    )

    this.lgSocketService
      .on<{ id: string; amount: number }>('change-health')
      .subscribe(({ id, amount }) => {
        if (id === this.id) {
          this.health.health = amount
        }
      })

    this.lgSocketService.on<string>('destroy').subscribe((id) => {
      if (id === this.id) {
        this.destroy(this)
      }
    })
  }

  public onLoop(): void {
    const overflowingX = isOverflowingX(
      this.getContext().canvas.width,
      this.transform.position.x,
      this.transform.totalDimensions.width,
    )
    const overflowingY = isOverflowingY(
      this.getContext().canvas.height,
      this.transform.position.y,
      this.transform.totalDimensions.height,
    )

    if (
      this.getComponent(Render) &&
      !this.getComponent(RenderOverflow) &&
      (this.isFragment || (!overflowingX && !overflowingY))
    ) {
      this.addComponent(RenderOverflow)
      this.destroy(this.getComponent(Render))
    }
  }

  public draw(): void {
    this.drawAsteroid()
  }

  private drawAsteroid(): void {
    this.getContext().translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.getContext().rotate(this.transform.rotation)

    this.getContext().beginPath()
    this.getContext().drawImage(
      this._image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.getContext().closePath()

    this.getContext().rotate(-this.transform.rotation)
    this.getContext().translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
