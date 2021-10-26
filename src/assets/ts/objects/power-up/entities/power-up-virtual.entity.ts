import { AbstractEntity, Entity, IOnAwake, IOnStart, Rect } from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import { Drawer } from '../../../shared/components/drawer.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'

import { PowerUpName, PowerUpType } from '../interfaces/power-up.interface'

/**
 * Class that represents the power up entity and its behavior.
 */
@Entity({
  services: [SocketService],
  components: [
    Drawer,
    Render,
    {
      id: '__power_up_rigidbody__',
      class: Rigidbody,
      use: {
        mass: 8,
      },
    },
    {
      id: '__power_up_transform__',
      class: Transform,
      use: {
        dimensions: new Rect(42, 36),
      },
    },
  ],
})
export class PowerUpVirtual
  extends AbstractEntity
  implements IOnAwake, IOnStart
{
  private socketService: SocketService

  tag = PowerUpVirtual.name

  /**
   * Property that contains the power up position, dimensions and rotation.
   */
  transform: Transform

  /**
   * Property that contains the power up physics.
   */
  rigidbody: Rigidbody

  name: PowerUpName

  type: PowerUpType

  /**
   * Property that defines the power up icon.
   */
  private image: HTMLImageElement

  onAwake(): void {
    this.socketService = this.getService(SocketService)

    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  onStart(): void {
    if (this.getComponent(Render)) {
      this.image = new Image()
      this.image.src = `./assets/svg/power-up-${this.name}.svg`
    }

    console.log('start')

    this.socketService.on<string>('destroy').subscribe((id) => {
      if (id === this.id) {
        console.log('destroy')
        this.destroy(this)
      }
    })
  }

  draw(): void {
    this.getContexts()[0].translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )

    this.getContexts()[0].beginPath()
    this.getContexts()[0].drawImage(
      this.image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.getContexts()[0].closePath()

    this.getContexts()[0].translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
