import { Vector2 } from '../engine/math/vector2'

export interface ISpaceship {
  /**
   * Property responsible for the spaceship acceleration force.
   */
  readonly force: number

  /**
   * Property responsible for the spaceship rotation force.
   */
  readonly angularForce: number

  /**
   * Property that indicates the direction that the spaceship is facing.
   */
  get direction(): Vector2
}
