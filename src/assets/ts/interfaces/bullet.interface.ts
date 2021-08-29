import { Vector2 } from '../engine/math/vector2'

export interface IBullet {
  /**
   * Property that indicates the direction that the bullet is heading to.
   */
  get direction(): Vector2
}
