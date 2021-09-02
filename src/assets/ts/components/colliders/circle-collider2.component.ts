import { Component, Vector2 } from '@asteroidsjs'

import { Rigidbody } from '../rigidbody.component'
import { Transform } from '../transform.component'
import { Collider2 } from './collider2.component'

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
export class CircleCollider2 extends Collider2 {
  /**
   * Method that check if two transforms are colliding
   *
   * @param transform1 defines the first transform
   * @param transform2 defines the second transform
   * @returns true if the distance between their centers is sufficient to
   * consider the collision
   */
  protected isColliding(transform1: Transform, transform2: Transform): boolean {
    return (
      Vector2.distance(transform1.position, transform2.position) <
      (transform1.dimensions.width + transform2.dimensions.width) / 2
    )
  }
}
