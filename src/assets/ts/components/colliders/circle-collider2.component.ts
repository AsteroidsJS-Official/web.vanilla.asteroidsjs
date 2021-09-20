import { abs, AbstractEntity, Component, Rect, Vector2 } from '@asteroidsjs'

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
    if (!this.devMode) {
      return
    }

    this.getContexts()[0].translate(
      this.canvasPosition.x,
      this.canvasPosition.y,
    )
    this.getContexts()[0].rotate(this.transform.rotation)

    this.getContexts()[0].beginPath()
    this.getContexts()[0].fillStyle = '#05FF0060'
    this.getContexts()[0].arc(0, 0, this.dimensions.width / 2, 0, 360)
    this.getContexts()[0].fill()

    this.getContexts()[0].rotate(-this.transform.rotation)
    this.getContexts()[0].translate(
      -this.canvasPosition.x,
      -this.canvasPosition.y,
    )
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

    return this.isCollidingWithCircle(entity.getComponent(Transform))
  }

  /**
   * Method that check if the this circular collider is colliding with
   * some rect collider
   *
   * @param collider defines the second entity
   * @returns true if the two entities are colliding, otherwise false
   */
  private isCollidingWithRect(collider: AbstractCollider): boolean {
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

  /**
   * Method that check if the two circle colliders are colliding
   *
   * @param collider defines the second entity
   * @returns true if the two entities are colliding, otherwise false
   */
  private isCollidingWithCircle(transform: {
    position: Vector2
    dimensions: Rect
  }): boolean {
    return (
      Vector2.distance(this.position, transform.position) <
      (this.dimensions.width + transform.dimensions.width) / 2
    )
  }
}
