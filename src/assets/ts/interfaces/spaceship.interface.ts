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
   * Property responsible for the spaceship bullet velocity.
   */
  readonly bulletVelocity: number

  /**
   * Property responsible for the spaceship bullet emission.
   */
  isShooting: boolean

  /**
   * Property that indicates the direction that the spaceship is facing.
   */
  get direction(): Vector2

  /**
   * Method responsible for shooting the spaceship bullets.
   */
  shoot(): void
}
