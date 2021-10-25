import {
  AbstractEntity,
  Entity,
  IOnAwake,
  IOnLoop,
  IOnStart,
  Rect,
} from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import { Drawer } from '../../../shared/components/drawer.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'

import {
  IPowerUp,
  PowerUpName,
  PowerUpType,
} from '../interfaces/power-up.interface'

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
export class PowerUp
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnLoop, IPowerUp
{
  private socketService: SocketService

  tag = PowerUp.name

  /**
   * Property that contains the power up position, dimensions and rotation.
   */
  transform: Transform

  /**
   * Property that contains the power up physics.
   */
  rigidbody: Rigidbody

  isPassive: boolean

  hasLifeTime: boolean

  lifeTime: number

  name: PowerUpName

  type: PowerUpType

  duration: number

  affectValue: number | number[]

  acquireSound: string

  activateSound: string

  dropChance: number

  /**
   * Property that defines the time that the power up was
   * generated.
   */
  private generationTime: Date

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
    this.generationTime = new Date()

    if (this.getComponent(Render)) {
      this.image = new Image()
      this.image.src = `./assets/svg/power-up-${this.name}.svg`
    }
  }

  onDestroy(): void {
    this.socketService.emit('destroy', this.id)
  }

  onLoop(): void {
    const hasOverflowX =
      this.transform.canvasPosition.x + this.transform.dimensions.width < 0 ||
      this.transform.canvasPosition.x - this.transform.dimensions.width >
        this.getContexts()[0].canvas.width
    const hasOverflowY =
      this.transform.canvasPosition.y + this.transform.dimensions.height < 0 ||
      this.transform.canvasPosition.y - this.transform.dimensions.height >
        this.getContexts()[0].canvas.height

    const generationDiff = new Date().getTime() - this.generationTime.getTime()

    if (
      hasOverflowX ||
      hasOverflowY ||
      (this.hasLifeTime &&
        generationDiff > (this.lifeTime * 1000) / this.timeScale)
    ) {
      this.destroy(this)
    }
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
