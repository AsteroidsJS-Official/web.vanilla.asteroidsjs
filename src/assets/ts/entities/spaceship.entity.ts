import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { Vector2 } from '../engine/core/vector2'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IStart } from '../engine/interfaces/start.interface'

export class Spaceship extends Entity implements IStart, IDraw {
  private transform: Transform
  private rigidbody: Rigidbody

  public start(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)

    this.transform.dimensions = new Vector2(50, 50);
    this.rigidbody.maxVelocity = 4;
  }

  public draw(): void {
    this.game.context.beginPath()
    this.game.context.fillStyle = '#ff0055'

    this.game.context.arc(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
      this.transform.dimensions.x / 2,
      0,
      2 * Math.PI,
    )
    this.game.context.fill()
  }
}
