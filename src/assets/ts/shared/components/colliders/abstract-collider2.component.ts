/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  AbstractComponent,
  IOnAwake,
  IOnFixedLoop,
  IDraw,
  Vector2,
  Rect,
  AbstractEntity,
  vector2ToAngle,
  angleToVector2,
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
export abstract class AbstractCollider
  extends AbstractComponent
  implements IOnAwake, IOnFixedLoop, IDraw
{
  /**
   * Property that represents the collider posision relative to it entity
   */
  localPosition = new Vector2()

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

  /**
   * Property that allows some methods to be called.
   */
  protected devMode = false

  /**
   * Property that represents the collider dimensions
   */
  private _dimensions: Rect

  /**
   * Property that represents the collider posision relative to it entity
   */
  get position(): Vector2 {
    return Vector2.sum(
      this.transform.position,
      Vector2.multiply(
        angleToVector2(
          vector2ToAngle(this.localPosition.normalized) -
            this.transform.rotation,
        ),
        this.localPosition.magnitude,
      ),
    )
  }

  /**
   * Property that represents the collider dimensions
   */
  get dimensions(): Rect {
    return this._dimensions ?? this.transform.dimensions
  }

  /**
   * Property that represents the collider dimensions
   */
  set dimensions(value: Rect) {
    this._dimensions = value
  }

  /**
   * Property that defines the entity position in html canvas
   */
  get canvasPosition(): Vector2 {
    return new Vector2(
      this.getContexts()[0].canvas.width / 2 + this.position.x,
      this.getContexts()[0].canvas.height / 2 - this.position.y,
    )
  }

  abstract draw(): void

  onAwake(): void {
    this.rigidbody = this.getComponent(Rigidbody)
    this.transform = this.getComponent(Transform)
  }

  onFixedLoop(): void {
    this.collisions.forEach((collision, i) => {
      if (this.isColliding(collision.entity2)) {
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

    rigidbodies.forEach((rigidbody) => {
      if (!this.isColliding(rigidbody.entity)) {
        return
      }

      let collision = this.collisions.find(
        (collision) =>
          collision.entity1 === this.entity &&
          collision.entity2 === rigidbody.entity,
      )

      if (!collision) {
        collision = {
          entity1: this.entity,
          entity2: rigidbody.entity,
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

  /**
   * Method that check if two rididbodies are colliding
   *
   * @param entity defines the second rigidbody
   * @returns true if the distance between their centers is sufficient to
   * consider the collision
   */
  protected abstract isColliding(entity: AbstractEntity): boolean
}
