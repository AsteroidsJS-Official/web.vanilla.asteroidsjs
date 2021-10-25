import {
  AbstractEntity,
  Entity,
  IOnAwake,
  IOnLoop,
  IOnStart,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { CircleCollider2 } from '../../../shared/components/colliders/circle-collider2.component'
import { Drawer } from '../../../shared/components/drawer.component'
import { Health } from '../../../shared/components/health.component'
import { RenderOverflow } from '../../../shared/components/renderers/render-overflow.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'
import { LookAt } from '../components/look-at.component'

import { ICollision2 } from '../../../shared/interfaces/collision2.interface'
import { IOnTriggerEnter } from '../../../shared/interfaces/on-trigger-enter.interface'

/**
 * Entity that represents the missile.
 */
@Entity({
  use: {
    tag: 'missile',
  },
  components: [
    Render,
    Drawer,
    {
      id: '__transform_missile__',
      class: Transform,
      use: {
        dimensions: new Rect(25, 50),
      },
    },
    {
      id: '__look_at_missile__',
      class: LookAt,
    },
    {
      id: '__look_at_rigidbody__',
      class: Rigidbody,
    },
    {
      class: CircleCollider2,
      use: {
        dimensions: new Rect(10, 10),
        localPosition: new Vector2(0, 20),
      },
    },
  ],
})
export class Missile
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnLoop, IOnTriggerEnter
{
  /**
   * Property that represents the default missile chase velocity.
   */
  velocity: number

  /**
   * Property that represents the {@link LookAt} component assigned to
   * this entity.
   */
  private _lookAt: LookAt

  /**
   * Property that represents the {@link Transform} component assigned to
   * this entity.
   */
  private _transform: Transform

  /**
   * Property that represents the {@link Rigidbody} component assigned to
   * this entity.
   */
  private _rigidbody: Rigidbody

  /**
   * Property that represents the missile image.
   */
  private _image: HTMLImageElement

  onAwake(): void {
    this._lookAt = this.getComponent(LookAt)
    this._transform = this.getComponent(Transform)
    this._rigidbody = this.getComponent(Rigidbody)
  }

  onStart(): void {
    if (this.getComponent(Render) || this.getComponent(RenderOverflow)) {
      this._image = new Image()
      this._image.src = './assets/svg/missile.svg'
    }
  }

  draw(): void {
    this.getContexts()[0].translate(
      this._transform.canvasPosition.x,
      this._transform.canvasPosition.y,
    )

    this.getContexts()[0].rotate(this._transform.rotation)

    this.getContexts()[0].beginPath()
    this.getContexts()[0].drawImage(
      this._image,
      0 - this._transform.dimensions.width / 2,
      0 - this._transform.dimensions.height / 2,
      this._transform.dimensions.width,
      this._transform.dimensions.height,
    )
    this.getContexts()[0].closePath()

    this.getContexts()[0].rotate(-this._transform.rotation)
    this.getContexts()[0].translate(
      -this._transform.canvasPosition.x,
      -this._transform.canvasPosition.y,
    )
  }

  onLoop(): void {
    const direction = Vector2.sum(
      this._transform.position,
      Vector2.multiply(this._lookAt.target.position, -1),
    ).normalized

    this._rigidbody.velocity = Vector2.multiply(direction, -this.velocity)
  }

  onTriggerEnter(coliision: ICollision2): void {
    coliision.entity2.getComponent(Health).hurt(500)
    this.destroy(this)
  }
}
