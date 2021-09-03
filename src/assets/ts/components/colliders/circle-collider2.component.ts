import { abs, AbstractEntity, Component, Vector2 } from '@asteroidsjs'

import { Rigidbody } from '../rigidbody.component'
import { Transform } from '../transform.component'
import { AbstractCollider } from './abstract-collider2.component'
import { RectCollider2 } from './rect-collider2.component'

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
export class CircleCollider2 extends AbstractCollider {
  draw(): void {
    this.getContext().translate(this.canvasPosition.x, this.canvasPosition.y)
    this.getContext().rotate(this.transform.rotation)

    this.getContext().beginPath()
    this.getContext().fillStyle = '#05FF0020'
    this.getContext().arc(0, 0, this.dimensions.width / 2, 0, 360)
    this.getContext().fill()

    this.getContext().rotate(-this.transform.rotation)
    this.getContext().translate(-this.canvasPosition.x, -this.canvasPosition.y)
  }

  /**
   * Method that check if some entity is colliding with this entity
   *
   * @param entity defines the second entity
   * @returns true if the two entities are colliding, otherwise false
   */
  protected isColliding(entity: AbstractEntity): boolean {
    if (entity === this.entity) {
      return false
    }

    const rectColliders = entity.getComponents(RectCollider2) ?? []
    const circleColliders = entity.getComponents(CircleCollider2) ?? []

    if (rectColliders.some((collider) => this.isCollidingWithRect(collider))) {
      return true
    }

    return circleColliders.some((collider) =>
      this.isCollidingWithCircle(collider),
    )
  }

  /**
   * Method that check if the this circular collider is colliding with
   * some rect collider
   *
   * @param entity defines the second entity
   * @returns true if the two entities are colliding, otherwise false
   */
  private isCollidingWithRect(entity: AbstractCollider): boolean {
    const transform = entity.getComponent(Transform)
    const diff = new Vector2(
      abs(this.position.x - transform.position.x),
      abs(this.position.y - transform.position.y),
    )

    if (diff.x > transform.dimensions.width / 2 + this.dimensions.width / 2) {
      return false
    }

    if (diff.y > transform.dimensions.height / 2 + this.dimensions.height / 2) {
      return false
    }

    if (diff.x <= transform.dimensions.width / 2) {
      return true
    }

    if (diff.y <= transform.dimensions.height / 2) {
      return true
    }

    const square =
      Math.pow(diff.x - transform.dimensions.width / 2, 2) +
      Math.pow(diff.y - transform.dimensions.height / 2, 2)

    return square <= Math.pow(this.dimensions.width / 2, 2)
  }

  /**
   * Method that check if the two circle colliders are colliding
   *
   * @param entity defines the second entity
   * @returns true if the two entities are colliding, otherwise false
   */
  private isCollidingWithCircle(entity: AbstractCollider): boolean {
    const transform = entity.getComponent(Transform)
    return (
      Vector2.distance(this.position, transform.position) <
      (this.dimensions.width + transform.dimensions.width) / 2
    )
  }
}
