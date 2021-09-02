/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  AbstractComponent,
  Component,
  IDraw,
  IOnAwake,
  IOnFixedLoop,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { Rigidbody } from '../rigidbody.component'
import { Transform } from '../transform.component'

import { ICollision2 } from '../../interfaces/collision2.interface'
import { IOnTriggerEnter } from '../../interfaces/on-trigger-enter.interface'
import { IOnTriggerExit } from '../../interfaces/on-trigger-exit.interface'
import { IOnTriggerStay } from '../../interfaces/on-trigger-stay.interface'

/**
 * Class that represents a component that deals with collisions with
 * different entities
 *
 * A collider only interacts with entities that have the {@link Rigidbody}
 * component in order to make this behaviour more performatic
 */
@Component({
  required: [Transform, Rigidbody],
})
export class Collider2
  extends AbstractComponent
  implements IOnAwake, IOnFixedLoop, IDraw
{
  /**
   * Property that defines an instance of the {@link Rigidbody} component
   */
  protected rigidbody: Rigidbody

  /**
   * Property that defines an instance of the {@link Transform} component
   */
  protected transform: Transform

  /**
   * Property that defines an array with all the entity collisions with
   * others rigidbodies
   */
  protected collisions: ICollision2[] = []

  private _position: Vector2

  private _dimensions: Rect

  get position(): Vector2 {
    return this._position ?? this.transform.position
  }

  set position(value: Vector2) {
    this._position = value
  }

  get dimensions(): Rect {
    return this._dimensions ?? this.transform.dimensions
  }

  set dimensions(value: Rect) {
    this._dimensions = value
  }

  onAwake(): void {
    this.rigidbody = this.getComponent(Rigidbody)
    this.transform = this.getComponent(Transform)
  }

  draw(): void {
    this.getContext().translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )

    this.getContext().beginPath()
    this.getContext().fillStyle = '#05FF0020'
    this.getContext().rect(
      -this.dimensions.width / 2,
      -this.dimensions.height / 2,
      this.dimensions.width,
      this.dimensions.height,
    )
    this.getContext().fill()

    this.getContext().translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  onFixedLoop(): void {
    this.collisions.forEach((collision, i) => {
      if (this.isColliding(collision.rigidbody2.getComponent(Transform))) {
        return
      }

      this.collisions = this.collisions.filter((_, index) => index !== i)

      if (this.hasOnTriggerExit(this.entity)) {
        this.entity.onTriggerExit(collision)
      }
    })

    const rigidbodies = this.find(Rigidbody).filter(
      (r) => r.entity != this.entity,
    )
    const transforms = rigidbodies.map((r) => r.getComponent(Transform))

    transforms.forEach((transform, i) => {
      if (!this.isColliding(transform)) {
        return
      }

      const rigidbody = rigidbodies[i]
      let collision = this.collisions.find(
        (collision) =>
          collision.rigidbody1 === this.rigidbody &&
          collision.rigidbody2 === rigidbody,
      )

      if (!collision) {
        collision = {
          rigidbody1: this.rigidbody,
          rigidbody2: rigidbody,
        }

        this.collisions.push(collision)

        if (this.hasOnTriggerEnter(this.entity)) {
          this.entity.onTriggerEnter(collision)
        }
      } else {
        if (this.hasOnTriggerStay(this.entity)) {
          this.entity.onTriggerStay(collision)
        }
      }
    })
  }

  /**
   * Method that check if two transforms are colliding
   *
   * @param transform2 defines the second transform
   * @returns true if the distance between their centers is sufficient to
   * consider the collision
   */
  protected isColliding(transform2: Transform): boolean {
    return !(
      this.position.x > transform2.position.x + transform2.dimensions.width ||
      this.position.x + this.dimensions.width < transform2.position.x ||
      this.position.y > transform2.position.y + transform2.dimensions.height ||
      this.position.y + this.dimensions.height < transform2.position.y
    )
  }

  /**
   * Method that validates if some object is of type {@link IOnTriggerEnter}
   *
   * @param entity defines an object that will be validated
   * @returns true if the object implements the {@link IOnTriggerEnter} interface, otherwise
   * false
   */
  protected hasOnTriggerEnter(entity: any): entity is IOnTriggerEnter {
    return 'onTriggerEnter' in entity
  }

  /**
   * Method that validates if some object is of type {@link IOnTriggerStay}
   *
   * @param entity defines an object that will be validated
   * @returns true if the object implements the {@link IOnTriggerStay} interface, otherwise
   * false
   */
  protected hasOnTriggerStay(entity: any): entity is IOnTriggerStay {
    return 'onTriggerStay' in entity
  }

  /**
   * Method that validates if some object is of type {@link IOnTriggerExit}
   *
   * @param entity defines an object that will be validated
   * @returns true if the object implements the {@link IOnTriggerExit} interface, otherwise
   * false
   */
  protected hasOnTriggerExit(entity: any): entity is IOnTriggerExit {
    return 'onTriggerExit' in entity
  }
}
