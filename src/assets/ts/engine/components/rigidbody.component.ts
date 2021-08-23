import { abs } from '../math/utils'

import { Component } from '../core/component'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Vector2 } from '../math/vector2'
import { Transform } from './transform.component'

/**
 * Component that adds physical behaviors such as velocity and acceleration to
 * an entity
 */
export class Rigidbody extends Component implements IStart, ILoop {
  /**
   * Property that defines the entity mass, that directly interfers with the
   * inertia of the entity
   */
  public mass = 1

  /**
   * Property that defines the sum of all the forces applied to the entity,
   * resulting in a movement or not
   */
  public resultant = new Vector2()

  /**
   * Property that defines the sum of all the forces applied to the entity,
   * resulting in a spin or not
   */
  public angularResultant = 0

  /**
   * Property that defines the max rotation velocity that entity can reach
   */
  public maxAngularVelocity = Infinity

  /**
   * Property that defines the max velocity that entity can reach
   */
  public maxVelocity = Infinity

  /**
   * Property that defines the current entity velocity
   */
  private _velocity = new Vector2()

  /**
   * Property that defines the current entity rotation velocity
   */
  private _angularVelocity = 0

  /**
   * Property that defines the transform component
   */
  private transform: Transform

  /**
   * Property that defines the current entity velocity
   */
  public get velocity(): Vector2 {
    return this._velocity
  }

  /**
   * Property that defines the current entity velocity
   */
  public set velocity(vector: Vector2) {
    if (vector.magnitude > this.maxVelocity) {
      const result = this.maxVelocity / vector.magnitude
      vector = new Vector2(vector.x * result, vector.y * result)
    }
    this._velocity = vector
  }

  /**
   * Property that defines the current entity rotation velocity
   */
  public get angularVelocity(): number {
    return this._angularVelocity
  }

  /**
   * Property that defines the current entity rotation velocity
   */
  public set angularVelocity(value: number) {
    const normalized =
      abs(value) > this.maxAngularVelocity
        ? this.maxAngularVelocity
        : abs(value)
    this._angularVelocity = value < 0 ? -normalized : normalized
  }

  public start(): void {
    this.requires([Transform])

    this.transform = this.getComponent(Transform)
  }

  public loop(): void {
    const angularAceleration = this.angularResultant / this.mass

    this.angularVelocity += angularAceleration
    this.transform.rotation += this.angularVelocity

    const aceleration = Vector2.multiply(
      new Vector2(this.resultant.x, this.resultant.y),
      1 / this.mass,
    )

    this.transform.position = Vector2.sum(
      this.transform.position,
      this.velocity,
    )
    this.velocity = Vector2.sum(this.velocity, aceleration)
  }

  private abs(value: number): number {
    return value < 0 ? -value : value
  }
}
