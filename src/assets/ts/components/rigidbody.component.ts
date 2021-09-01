import {
  abs,
  AbstractComponent,
  Component,
  IOnAwake,
  IOnLoop,
  Vector2,
} from '@asteroidsjs'

import { Transform } from './transform.component'
/**
 * Component that adds physical behaviors such as velocity and
 * acceleration to an entity
 */
@Component({
  required: [Transform],
})
export class Rigidbody extends AbstractComponent implements IOnAwake, IOnLoop {
  /**
   * Property that defines the entity mass, that directly interfers with
   * the inertia of the entity
   */
  public mass = 1

  /**
   * Property that defines a value that represents the friction applied
   * to some rigidbody that desacelerates it based on the velocity value
   */
  public friction = 0

  /**
   * Property that defines the sum of all the forces applied to the
   * entity, resulting in a movement or not
   */
  public resultant = new Vector2()

  /**
   * Property that defines the sum of all the forces applied to the
   * entity, resulting in a spin or not
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

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  public onLoop(): void {
    this.updateRotation()
    this.updatePosition()
    this.applyFriction()
  }

  /**
   * Method that changes the rigidbody rotation based on the properties
   * related to it such as `angularResultant` and `angularVelocity`
   */
  private updateRotation(): void {
    const angularAceleration = this.angularResultant / this.mass
    this.angularVelocity += angularAceleration
    this.transform.rotation += this.angularVelocity
  }

  /**
   * Method that changes the rigidbody position based on the propertie
   * related to it, such as `resultant` and `velocity`
   */
  private updatePosition(): void {
    const aceleration = Vector2.multiply(this.resultant, 1 / this.mass)
    this.transform.position = Vector2.sum(
      this.transform.position,
      this.velocity,
    )
    this.velocity = Vector2.sum(this.velocity, aceleration)
  }

  /**
   * Method that applies the fricion based on the properties related to
   * it, such as `resultant`, `velocity` and `mass`
   */
  private applyFriction(): void {
    let force = Vector2.multiply(this.velocity.normalized, -1)
    const normal = this.mass
    force = Vector2.multiply(force, this.friction * normal)
    this.resultant = force
  }
}
