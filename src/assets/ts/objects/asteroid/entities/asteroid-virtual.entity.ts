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

import { SocketService } from '../../../shared/services/socket.service'

import { Drawer } from '../../../shared/components/drawer.component'
import { Health } from '../../../shared/components/health.component'
import { RenderOverflow } from '../../../shared/components/renderers/render-overflow.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'

/**
 * Class that represents the virtual asteroid entity and its behavior.
 */
@Entity({
  services: [SocketService],
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
  private socketService: SocketService

  /**
   * Property that contains the asteroid position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property that defines the asteroid size.
   */
  private _asteroidSize: number

  /**
   * Property that defines the asteroid image.
   */
  private image: HTMLImageElement

  /**
   * Property that contains the asteroid health status.
   */
  public health: Health

  /**
   * Property that defines the asteroid image url.
   */
  public imageSrc: string

  /**
   * Property that defines whether the asteroid is a fragment
   * from another.
   */
  public isFragment = false

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.socketService = this.getService(SocketService)
    this.transform = this.getComponent(Transform)
    this.health = this.getComponent(Health)
  }

  public onStart(): void {
    if (this.getComponent(Render) || this.getComponent(RenderOverflow)) {
      this.image = new Image()
      this.image.src = this.imageSrc
    }

    this.transform.dimensions = new Rect(
      10 * ((this._asteroidSize + 2) * 2),
      10 * ((this._asteroidSize + 2) * 2),
    )

    this.socketService
      .on<{ id: string; amount: number }>('change-health')
      .subscribe(({ id, amount }) => {
        if (id === this.id) {
          this.health.health = amount
        }
      })

    this.socketService.on<string>('destroy').subscribe((id) => {
      if (id === this.id) {
        this.destroy(this)
      }
    })
  }

  public onLoop(): void {
    const overflowingX = isOverflowingX(
      this.getContexts()[0].canvas.width,
      this.transform.position.x,
      this.transform.totalDimensions.width,
    )
    const overflowingY = isOverflowingY(
      this.getContexts()[0].canvas.height,
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
    this.getContexts()[0].translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.getContexts()[0].rotate(this.transform.rotation)

    this.getContexts()[0].beginPath()
    this.getContexts()[0].drawImage(
      this.image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.getContexts()[0].closePath()

    this.getContexts()[0].rotate(-this.transform.rotation)
    this.getContexts()[0].translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
