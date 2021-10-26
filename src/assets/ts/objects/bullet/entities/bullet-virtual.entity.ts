import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnLoop,
  IOnStart,
  Vector2,
} from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import { Drawer } from '../../../shared/components/drawer.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'

import { IBullet } from '../interfaces/bullet.interface'

/**
 * Class that represents the virtual bullet entity and its behavior.
 */
@Entity({
  services: [SocketService],
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
  private socketService: SocketService

  /**
   * Property that contains the bullet position, dimensions and rotation.
   */
  public transform: Transform

  /**
   * Property that contains the bullet physics.
   */
  public rigidbody: Rigidbody

  /**
   * Property that links the bullet to its user by the user id.
   */
  public userId: string

  /**
   * Property that represents the bullet direction.
   */
  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  onAwake(): void {
    this.socketService = this.getService(SocketService)
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  onStart(): void {
    this.socketService.on<string>('destroy').subscribe((id) => {
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

    this.getContexts()[0].shadowColor = '#00ffff'
    this.getContexts()[0].shadowBlur = 25

    this.getContexts()[0].beginPath()
    this.getContexts()[0].fillStyle = '#00ffff'
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
