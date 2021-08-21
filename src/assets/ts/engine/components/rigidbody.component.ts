import { Component } from '../core/component'
import { Vector2 } from '../core/vector2'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Transform } from './transform.component'

export class Rigidbody extends Component implements IStart, ILoop {
  public mass = 1
  public resultant = new Vector2()
  public maxVelocity = Infinity;

  private _velocity = new Vector2()
  private transform: Transform

  public get velocity(): Vector2 {
    return this._velocity;
  }

  public set velocity(velocity: Vector2){
    if(velocity.magnitude > this.maxVelocity){
      const result = this.maxVelocity / velocity.magnitude;

      velocity = new Vector2(velocity.x * result, velocity.y * result);
    }

    this._velocity = velocity;
  }

  public start(): void {
    this.requires([Transform])

    this.transform = this.getComponent(Transform)
  }

  public loop(): void {
    const aceleration = Vector2.divide(
      new Vector2(this.resultant.x, this.resultant.y),
      this.mass,
    )

    this.transform.position = Vector2.sum(this.transform.position, this.velocity)
    this.velocity = Vector2.sum(this.velocity, aceleration)
  }
}
