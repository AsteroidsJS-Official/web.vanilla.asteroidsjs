import { Rigidbody } from '../components/rigidbody.component'
import { Vector2 } from '../engine/core/math/vector2'

/**
 * Interface that represents a collision between two {@link Rigidbody}
 * entities
 */
export interface Collision2 {
  /**
   * Property that defines the collision point
   *
   * @todo Not implemented yet
   */
  point?: Vector2

  /**
   * Property that defines an object that represents one of the two
   * rigidbodies that have collided
   */
  rigidbody1: Rigidbody

  /**
   * Property that defines an object that represents one of the two
   * rigidbodies that have collided
   */
  rigidbody2: Rigidbody
}
