import { AvoidOverflow } from '../engine/components/avoid-overflow.component'
import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { Vector2 } from '../engine/core/vector2'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IStart } from '../engine/interfaces/start.interface'
import { Spaceship } from './spaceship.entity'

export class Ball extends Entity implements IStart, IDraw {
  private transform: Transform

  public start(): void {
    this.transform = this.getComponent(Transform)
    this.getComponent(Rigidbody).velocity = new Vector2(0, 1)

    setInterval(() => {
      this.createSpaceship()
    }, 3000)
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

  private createSpaceship(): void {
    const spaceship = this.instantiate({
      entity: Spaceship,
      components: [Transform, Rigidbody, AvoidOverflow],
    })

    spaceship.getComponent(Transform).position =
      this.getComponent(Transform).position

    spaceship.getComponent(Rigidbody).velocity = new Vector2(1, 0)
  }
}
