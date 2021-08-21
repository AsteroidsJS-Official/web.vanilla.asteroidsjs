import { Component } from '../core/component'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Vector2 } from '../math/vector2'
import { Transform } from './transform.component'

export class Rigidbody extends Component implements IStart, ILoop {
  public mass = 1
  public resultant = new Vector2()
  public angularResultant = 0
  public maxAngularVelocity = Infinity
  public maxVelocity = Infinity

  public _angularVelocity = 0
  private _velocity = new Vector2()

  private transform: Transform

  public get velocity(): Vector2 {
    return this._velocity
  }

  public set velocity(vector: Vector2) {
    if (vector.magnitude > this.maxVelocity) {
      const result = this.maxVelocity / vector.magnitude
      vector = new Vector2(vector.x * result, vector.y * result)
    }
    this._velocity = vector
  }

  public get angularVelocity(): number {
    return this._angularVelocity
  }

  public set angularVelocity(value: number) {
    const normalized =
      this.abs(value) > this.maxAngularVelocity
        ? this.maxAngularVelocity
        : this.abs(value)
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
