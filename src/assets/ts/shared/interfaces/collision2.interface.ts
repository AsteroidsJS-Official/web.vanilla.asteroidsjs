import { AbstractEntity, Vector2 } from '@asteroidsjs'

/**
 * Interface that represents a collision between two {@link AbstractEntity}
 * entities
 */
export interface ICollision2 {
  /**
   * Property that defines the collision point
   *
   * @todo Not implemented yet
   */
  point?: Vector2

  /**
   * Property that defines an object that represents one of the two
   * entities that have collided
   */
  entity1: AbstractEntity

  /**
   * Property that defines an object that represents one of the two
   * entities that have collided
   */
  entity2: AbstractEntity
}
