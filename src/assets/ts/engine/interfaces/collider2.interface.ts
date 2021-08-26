import { Collision2 } from './collision2.interface'

/**
 * Interface that represents an entity that have as dependency a {@link Collider} component
 */
export interface ICollider2 {
  /**
   * Method called by the {@link Collider} when the collision starts
   *
   * @param collision defines an object that represents the collision data
   */
  startCollide(collision: Collision2): void

  /**
   * Method called by the {@link Collider} when the collision is happening
   *
   * @param collision defines an object that represents the collision data
   */
  stayCollide(collision: Collision2): void

  /**
   * Method called by the {@link Collider} when the collision ends
   *
   * @param collision defines an object that represents the collision data
   */
  endCollide(collision: Collision2): void
}
