import { Vector2 } from '@asteroidsjs'

export interface IBullet {
  /**
   * Property that indicates the direction that the bullet is heading to.
   */
  get direction(): Vector2
}
