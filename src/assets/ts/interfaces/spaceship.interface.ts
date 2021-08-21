import { Vector2 } from '../engine/math/vector2'

export interface ISpaceship {
  readonly force: number
  readonly angularForce: number
  get direction(): Vector2
}
