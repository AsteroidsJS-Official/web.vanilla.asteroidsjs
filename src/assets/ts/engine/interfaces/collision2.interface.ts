import { Rigidbody } from '../components/rigidbody.component'
import { Vector2 } from '../math/vector2'

export interface Collision2 {
  point?: Vector2
  rigidbody1: Rigidbody
  rigidbody2: Rigidbody
}
