import { Collision2 } from './collision2.interface'

export interface ICollider2 {
  startCollide(collision: Collision2): void

  stayCollide(collision: Collision2): void

  endCollide(collision: Collision2): void
}
