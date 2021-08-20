import { Component } from '../core/component'
import { Entity } from '../core/entity'
import { Vector2 } from '../core/vector2'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Transform } from './transform.component'

export class Rigidbody extends Component implements IStart, ILoop {
  public mass = 1
  public velocity = new Vector2()
  public resultant = new Vector2()

  private transform: Transform

  public start(): void {
    this.requires([Transform])

    this.transform = this.getComponent(Transform)
  }

  public loop(): void {
    const aceleration = Vector2.divide(
      new Vector2(this.resultant.x, this.resultant.y),
      this.mass,
    )
    const velocity = new Vector2(this.velocity.x, this.velocity.y)

    this.transform.position = Vector2.sum(this.transform.position, velocity)
    this.velocity = Vector2.sum(this.velocity, aceleration)
  }
}
