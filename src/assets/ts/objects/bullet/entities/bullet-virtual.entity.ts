import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnLoop,
  IOnStart,
  Vector2,
} from '@asteroidsjs'

import { LGSocketService } from '../../../shared/services/lg-socket.service'

import { Drawer } from '../../../shared/components/drawer.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'

import { IBullet } from '../interfaces/bullet.interface'

@Entity({
  services: [LGSocketService],
  components: [
    Drawer,
    Render,
    {
      id: '__bullet_virtual_transform__',
      class: Transform,
    },
    {
      id: '__bullet_virtual_rigidbody__',
      class: Rigidbody,
    },
  ],
})
export class BulletVirtual
  extends AbstractEntity
  implements IBullet, IDraw, IOnAwake, IOnLoop, IOnStart
{
  private lgSocketService: LGSocketService

  public transform: Transform

  public rigidbody: Rigidbody

  public userId: string

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  onStart(): void {
    this.lgSocketService.on<string>('destroy').subscribe((id) => {
      if (id === this.id) {
        this.destroy(this)
      }
    })
  }

  draw(): void {
    this.getContexts()[0].translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.getContexts()[0].rotate(this.transform.rotation)

    this.getContexts()[0].shadowColor = 'yellow'
    this.getContexts()[0].shadowBlur = 25

    this.getContexts()[0].beginPath()
    this.getContexts()[0].fillStyle = '#ffc887'
    this.getContexts()[0].rect(
      0,
      0,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.getContexts()[0].fill()
    this.getContexts()[0].closePath()

    this.getContexts()[0].shadowColor = 'transparent'
    this.getContexts()[0].shadowBlur = 0

    this.getContexts()[0].rotate(-this.transform.rotation)
    this.getContexts()[0].translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  onLoop(): void {
    const hasOverflowX =
      this.transform.canvasPosition.x + this.transform.dimensions.width + 50 <
        0 ||
      this.transform.canvasPosition.x - this.transform.dimensions.width - 50 >
        this.getContexts()[0].canvas.width
    const hasOverflowY =
      this.transform.canvasPosition.y + this.transform.dimensions.height + 50 <
        0 ||
      this.transform.canvasPosition.y - this.transform.dimensions.height - 50 >
        this.getContexts()[0].canvas.height

    if (hasOverflowX || hasOverflowY) {
      this.destroy(this)
    }
  }
}
