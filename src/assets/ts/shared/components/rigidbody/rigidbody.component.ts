import {
  abs,
  AbstractComponent,
  Component,
  IOnAwake,
  IOnFixedLoop,
  IOnLoop,
  Vector2,
} from '@asteroidsjs'

import { Transform } from '../transform.component'

/**
 * Component that adds physical behaviors such as velocity and
 * acceleration to an entity
 */
@Component({
  required: [Transform],
})
export class Rigidbody
  extends AbstractComponent
  implements IOnAwake, IOnLoop, IOnFixedLoop
{
  /**
   * Property that defines an error value used to avoid some unexpected
   * behaviours like the "friction vibration".
   */
  public error = 0.001

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
   * Property that defines the sum of all the forces applied to the
   * entity, resulting in a movement or not
   */
  private _resultant = new Vector2()

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
    this._velocity = vector.magnitude < this.error ? new Vector2() : vector
  }

  /**
   * Property that defines the sum of all the forces applied to the
   * entity, resulting in a movement or not
   */
  public get resultant(): Vector2 {
    return this._resultant
  }

  /**
   * Property that defines the sum of all the forces applied to the
   * entity, resulting in a movement or not
   */
  public set resultant(value: Vector2) {
    this._resultant = value.magnitude < this.error ? new Vector2() : value
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

  onFixedLoop(): void {
    if (!this.enabled) {
      return
    }

    this.refreshDeltaTime()
  }

  public onLoop(): void {
    if (!this.enabled) {
      return
    }

    this.updateRotation()
    this.updatePosition()
    this.applyFriction()
  }

  /**
   * Method that changes the rigidbody rotation based on the properties
   * related to it such as `angularResultant` and `angularVelocity`
   */
  private updateRotation(): void {
    const angularAceleration = this.angularResultant * this.mass
    this.angularVelocity += angularAceleration * this.deltaTime
    this.transform.rotation += this.angularVelocity * this.deltaTime
  }

  /**
   * Method that changes the rigidbody position based on the propertie
   * related to it, such as `resultant` and `velocity`
   */
  private updatePosition(): void {
    const aceleration = Vector2.multiply(this.resultant, 1 / this.mass)

    this.transform.position = Vector2.sum(
      this.transform.position,
      Vector2.multiply(this.velocity, this.deltaTime),
    )
    this.velocity = Vector2.sum(
      this.velocity,
      Vector2.multiply(aceleration, this.deltaTime),
    )
  }

  /**
   * Method that applies the fricion based on the properties related to
   * it, such as `resultant`, `velocity` and `mass`
   */
  private applyFriction(): void {
    let force = Vector2.multiply(this.velocity.normalized, -1)
    const normal = this.mass
    force = Vector2.multiply(force, this.friction * normal)
    this.resultant = Vector2.multiply(force, this.deltaTime)
  }
}
