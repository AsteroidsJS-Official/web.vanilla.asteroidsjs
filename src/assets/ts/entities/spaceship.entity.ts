import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { ICollider2 } from '../engine/interfaces/collider2.interface'
import { Collision2 } from '../engine/interfaces/collision2.interface'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IStart } from '../engine/interfaces/start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { ISpaceship } from '../interfaces/spaceship.interface'

export class Spaceship
  extends Entity
  implements ISpaceship, IStart, IDraw, ICollider2
{
  private transform: Transform
  private rigidbody: Rigidbody

  public readonly force = 0.2
  public readonly angularForce = 0.01

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  public start(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)

<<<<<<< HEAD
    this.transform.dimensions = new Rect(-25, -25, 50, 50)
=======
    this.transform.dimensions = new Rect(50, 50)
>>>>>>> feature/collider
    this.rigidbody.mass = 10
    this.rigidbody.maxVelocity = 2
    this.rigidbody.maxAngularVelocity = 0.025
  }

  public startCollide(collision: Collision2): void {
    console.log('init')
  }

  public stayCollide(collision: Collision2): void {
    console.log('stay')
  }

  public endCollide(collision: Collision2): void {
    console.log('end')
  }

  public draw(): void {
    this.drawTriangle()
  }

  private drawTriangle(): void {
    this.game.context.translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.game.context.rotate(this.transform.rotation)

    this.game.context.beginPath()
    this.game.context.fillStyle = '#ff0055'
    this.game.context.moveTo(0, -this.transform.dimensions.height / 2)
    this.game.context.lineTo(
      -this.transform.dimensions.width / 2,
      this.transform.dimensions.height / 2,
    )
    this.game.context.lineTo(
      this.transform.dimensions.width / 2,
      this.transform.dimensions.height / 2,
    )
    this.game.context.closePath()
    this.game.context.fill()

    this.game.context.rotate(-this.transform.rotation)
    this.game.context.translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
