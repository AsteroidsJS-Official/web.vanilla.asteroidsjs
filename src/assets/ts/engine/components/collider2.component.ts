import { hasCollider } from '../utils/validations'

import { Component } from '../core/component'
import { ICollider2 } from '../interfaces/collider2.interface'
import { Collision2 } from '../interfaces/collision2.interface'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Vector2 } from '../math/vector2'
import { Rigidbody } from './rigidbody.component'
import { Transform } from './transform.component'

export class Collider2 extends Component implements IStart, ILoop {
  private collider: ICollider2
  private rigidbody: Rigidbody
  private transform: Transform

  private collisions: Collision2[] = []

  public start(): void {
    this.requires([Transform, Rigidbody])

    if (!hasCollider(this.entity)) {
      throw new Error(
        `${this.entity.constructor.name} has a ${this.constructor.name} but not implements the ICollider2 interface`,
      )
    }

    this.collider = this.entity
    this.rigidbody = this.getComponent(Rigidbody)
    this.transform = this.getComponent(Transform)
  }

  public loop(): void {
    const rigidbodies = this.findRigibodies()

    for (const [index, collision] of this.collisions.entries()) {
      const transform1 = collision.rigidbody1.getComponent(Transform)
      const transform2 = collision.rigidbody2.getComponent(Transform)

      if (
        Vector2.distance(transform1.position, transform2.position) <
        (transform1.dimensions.width + transform2.dimensions.width) / 2
      ) {
        continue
      }

      this.collisions = this.collisions.filter((_, i) => i !== index)
      this.collider.endCollide(collision)
    }

    const transforms = rigidbodies.map((rigidbody) =>
      rigidbody.getComponent(Transform),
    )
    for (const [index, transform] of transforms.entries()) {
      if (
        Vector2.distance(this.transform.position, transform.position) >
        (this.transform.dimensions.width + transform.dimensions.width) / 2
      ) {
        continue
      }

      let collision = this.collisions.find(
        (collision) =>
          collision.rigidbody1 === this.rigidbody &&
          collision.rigidbody2 === rigidbodies[index],
      )

      if (!collision) {
        collision = {
          rigidbody1: this.rigidbody,
          rigidbody2: rigidbodies[index],
        }
        this.collisions.push(collision)
        this.collider.startCollide(collision)
      } else {
        this.collider.stayCollide(collision)
      }
    }
  }

  private findRigibodies(): Rigidbody[] {
    return this.game.entities
      .filter((entity) => entity != this.entity)
      .map((entity) => entity.getComponent(Rigidbody))
  }
}
