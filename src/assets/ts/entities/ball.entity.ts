import { AvoidOverflow } from '../engine/components/avoid-overflow.component'
import { Image } from '../engine/components/image.component'
import { Render } from '../engine/components/render.component'
import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { Vector2 } from '../engine/core/vector2'
import { IStart } from '../engine/interfaces/start.interface'
import { Spaceship } from './spaceship.entity'

export class Ball extends Entity implements IStart {
  public start(): void {
    this.getComponent(Rigidbody).velocity = new Vector2(0, 1)

    setInterval(() => {
      const spaceship = this.instantiate(Spaceship, [
        Image,
        Transform,
        Rigidbody,
        Render,
        AvoidOverflow,
      ])

      spaceship.getComponent(Transform).position =
        this.getComponent(Transform).position

      spaceship.getComponent(Rigidbody).velocity = new Vector2(1, 0)
    }, 3000)
  }
}
