/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { abs, AbstractEntity, Component, Rect, Vector2 } from '@asteroidsjs'

import { Rigidbody } from '../rigidbody.component'
import { Transform } from '../transform.component'
import { AbstractCollider } from './abstract-collider2.component'
import { CircleCollider2 } from './circle-collider2.component'

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
export class RectCollider2 extends AbstractCollider {
  draw(): void {
    if (!this.devMode) {
      return
    }

    this.getContexts()[0].translate(
      this.canvasPosition.x,
      this.canvasPosition.y,
    )

    this.getContexts()[0].beginPath()
    this.getContexts()[0].fillStyle = '#05FF0020'
    this.getContexts()[0].rect(
      -this.dimensions.width / 2,
      -this.dimensions.height / 2,
      this.dimensions.width,
      this.dimensions.height,
    )
    this.getContexts()[0].fill()

    this.getContexts()[0].translate(
      -this.canvasPosition.x,
      -this.canvasPosition.y,
    )
  }

  /**
   * Method that check if two rididbodies are colliding
   *
   * @param entity defines the second rigidbody
   * @returns true if the distance between their centers is sufficient to
   * consider the collision
   */
  protected isColliding(entity: AbstractEntity): boolean {
    if (entity === this.entity) {
      return false
    }

    const rectColliders = entity.getComponents(RectCollider2) ?? []
    const circleColliders = entity.getComponents(CircleCollider2) ?? []

    if (rectColliders && rectColliders.length) {
      return rectColliders.some((collider) =>
        this.isCollidingWithRect(collider),
      )
    }

    if (circleColliders && circleColliders.length) {
      return circleColliders.some((collider) =>
        this.isCollidingWithCircle(collider),
      )
    }

    return this.isCollidingWithRect(entity.getComponent(Transform))
  }

  /**
   * Method that check if the two rect colliders are colliding
   *
   * @param transform defines the second entity
   * @returns true if the two entities are colliding, otherwise false
   */
  private isCollidingWithRect(transform: {
    position: Vector2
    dimensions: Rect
  }): boolean {
    return !(
      this.position.x + this.dimensions.width / 2 <
        transform.position.x - transform.dimensions.width / 2 ||
      this.position.x - this.dimensions.width / 2 >
        transform.position.x + transform.dimensions.width / 2 ||
      this.position.y + this.dimensions.height / 2 <
        transform.position.y - transform.dimensions.height / 2 ||
      this.position.y - this.dimensions.height / 2 >
        transform.position.y + transform.dimensions.height / 2
    )
  }

  /**
   * Method that check if the this circular collider is colliding with
   * some rect collider
   *
   * @param collider defines the second entity
   * @returns true if the two entities are colliding, otherwise false
   */
  private isCollidingWithCircle(collider: AbstractCollider): boolean {
    const diff = new Vector2(
      abs(this.position.x - collider.position.x),
      abs(this.position.y - collider.position.y),
    )

    if (diff.x > collider.dimensions.width / 2 + this.dimensions.width / 2) {
      return false
    }

    if (diff.y > collider.dimensions.height / 2 + this.dimensions.height / 2) {
      return false
    }

    if (diff.x <= collider.dimensions.width / 2) {
      return true
    }

    if (diff.y <= collider.dimensions.height / 2) {
      return true
    }

    const square =
      Math.pow(diff.x - collider.dimensions.width / 2, 2) +
      Math.pow(diff.y - collider.dimensions.height / 2, 2)

    return square <= Math.pow(this.dimensions.width / 2, 2)
  }
}
