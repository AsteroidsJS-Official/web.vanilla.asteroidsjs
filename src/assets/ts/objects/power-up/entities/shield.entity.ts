import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnDestroy,
  IOnFixedLoop,
  IOnLoop,
  IOnStart,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import { Bullet } from '../../bullet/entities/bullet.entity'
import { Spaceship } from '../../spaceship/entities/spaceship.entity'
import { PowerUp } from './power-up.entity'

import { CircleCollider2 } from '../../../shared/components/colliders/circle-collider2.component'
import { Drawer } from '../../../shared/components/drawer.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'
import { Shield as ShieldComponent } from './../components/shield.component'

import { ICollision2 } from '../../../shared/interfaces/collision2.interface'
import { IOnTriggerEnter } from '../../../shared/interfaces/on-trigger-enter.interface'

/**
 * Class that represents the shield entity and its behavior.
 */
@Entity({
  services: [SocketService],
  components: [
    Drawer,
    Render,
    Rigidbody,
    {
      id: '__shield_transform__',
      class: Transform,
    },
    {
      class: CircleCollider2,
      use: {
        localPosition: new Vector2(),
      },
    },
  ],
})
export class Shield
  extends AbstractEntity
  implements
    IDraw,
    IOnAwake,
    IOnStart,
    IOnLoop,
    IOnFixedLoop,
    IOnDestroy,
    IOnTriggerEnter
{
  private socketService: SocketService

  /**
   * Property that contains the bullet position, dimensions and rotation.
   */
  transform: Transform

  /**
   * Property that contains the bullet physics.
   */
  collider: CircleCollider2

  /**
   * Property that links the bullet to its user by the user id.
   */
  userId: string

  /**
   * Property that defines the amount of health to be healed.
   */
  radius: number

  /**
   * Property that defines the shield health.
   */
  shieldHealth: number

  /**
   * Property that defines the duration of the shield.
   */
  duration: number

  /**
   * Property that defines the hitting audio source.
   */
  readonly hitSound = 'laser-hit.mp3'

  /**
   * Property that defines how many milliseconds the shield was on.
   */
  private accumulatedTime = 0

  private image: HTMLImageElement

  onAwake(): void {
    this.socketService = this.getService(SocketService)

    this.transform = this.getComponent(Transform)
    this.collider = this.getComponent(CircleCollider2)
  }

  onStart(): void {
    const size = this.transform.parent.dimensions.width * this.radius
    this.collider.dimensions = new Rect(size, size)
    this.transform.dimensions = new Rect(size, size)

    this.image = new Image()
    this.image.src = './assets/svg/shield.svg'
  }

  onDestroy(): void {
    this.destroy(this.transform.parent.getComponent(ShieldComponent))

    console.log('destroy')

    this.socketService.emit('destroy', this.id)
  }

  onFixedLoop(): void {
    this.refreshDeltaTime()
  }

  onLoop(): void {
    this.accumulatedTime += this.deltaTime

    if (this.accumulatedTime >= this.duration * 1000) {
      this.destroy(this)
    }
  }

  onTriggerEnter(collision: ICollision2): void {
    if (
      collision.entity2.tag?.includes(Shield.name) ||
      collision.entity2.tag?.includes(PowerUp.name) ||
      (collision.entity2.tag?.includes(Bullet.name) &&
        (collision.entity2 as Bullet).userId === this.userId) ||
      (collision.entity2.tag?.includes(Spaceship.name) &&
        (collision.entity2 as Spaceship).userId === this.userId)
    ) {
      return
    }

    this.destroy(collision.entity2)
  }

  draw(): void {
    this.getContexts()[0].translate(
      this.transform.parent.canvasPosition.x,
      this.transform.parent.canvasPosition.y,
    )

    this.getContexts()[0].beginPath()
    this.getContexts()[0].drawImage(
      this.image,
      0 - (this.transform.parent.dimensions.width * this.radius) / 2,
      0 - (this.transform.parent.dimensions.height * this.radius) / 2,
      this.transform.parent.dimensions.width * this.radius,
      this.transform.parent.dimensions.height * this.radius,
    )
    this.getContexts()[0].closePath()

    this.getContexts()[0].translate(
      -this.transform.parent.canvasPosition.x,
      -this.transform.parent.canvasPosition.y,
    )
  }
}
