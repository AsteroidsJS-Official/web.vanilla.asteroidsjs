import {
  AbstractComponent,
  Component,
  IOnAwake,
  IOnFixedLoop,
  Vector2,
} from '@asteroidsjs'

import { Rigidbody } from './rigidbody.component'
import { Transform } from './transform.component'

import { ICollision2 } from '../interfaces/collision2.interface'
import { IOnTriggerEnter } from '../interfaces/on-trigger-enter.interface'
import { IOnTriggerExit } from '../interfaces/on-trigger-exit.interface'
import { IOnTriggerStay } from '../interfaces/on-trigger-stay.interface'

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
export class CircleCollider2
  extends AbstractComponent
  implements IOnAwake, IOnFixedLoop
{
  /**
   * Property that defines an instance of the {@link Rigidbody} component
   */
  private rigidbody: Rigidbody

  /**
   * Property that defines an instance of the {@link Transform} component
   */
  private transform: Transform

  /**
   * Property that defines an array with all the entity collisions with
   * others rigidbodies
   */
  private collisions: ICollision2[] = []

  onAwake(): void {
    this.rigidbody = this.getComponent(Rigidbody)
    this.transform = this.getComponent(Transform)
  }

  onFixedLoop(): void {
    this.collisions.forEach((collision, i) => {
      if (
        this.isColliding(
          collision.rigidbody1.getComponent(Transform),
          collision.rigidbody2.getComponent(Transform),
        )
      ) {
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
      if (!this.isColliding(this.transform, transform)) {
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
   * @param transform1 defines the first transform
   * @param transform2 defines the second transform
   * @returns true if the distance between their centers is sufficient to
   * consider the collision
   */
  private isColliding(transform1: Transform, transform2: Transform): boolean {
    return (
      Vector2.distance(transform1.position, transform2.position) <
      (transform1.dimensions.width + transform2.dimensions.width) / 2
    )
  }

  /**
   * Method that validates if some object is of type {@link IOnTriggerEnter}
   *
   * @param entity defines an object that will be validated
   * @returns true if the object implements the {@link IOnTriggerEnter} interface, otherwise
   * false
   */
  private hasOnTriggerEnter(entity: any): entity is IOnTriggerEnter {
    return 'onTriggerEnter' in entity
  }

  /**
   * Method that validates if some object is of type {@link IOnTriggerStay}
   *
   * @param entity defines an object that will be validated
   * @returns true if the object implements the {@link IOnTriggerStay} interface, otherwise
   * false
   */
  private hasOnTriggerStay(entity: any): entity is IOnTriggerStay {
    return 'onTriggerStay' in entity
  }

  /**
   * Method that validates if some object is of type {@link IOnTriggerExit}
   *
   * @param entity defines an object that will be validated
   * @returns true if the object implements the {@link IOnTriggerExit} interface, otherwise
   * false
   */
  private hasOnTriggerExit(entity: any): entity is IOnTriggerExit {
    return 'onTriggerExit' in entity
  }
}
