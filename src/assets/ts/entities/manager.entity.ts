import { SocketUpdateTransform } from '../engine/components/socket-update-transform.component'

import { AvoidOverflow } from '../engine/components/avoid-overflow.component'
import { Input } from '../engine/components/input.component'
import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { IStart } from '../engine/interfaces/start.interface'
import { SpaceshipVirtual } from './spaceship-virtual.entity'
import { Spaceship } from './spaceship.entity'

export class Manager extends Entity implements IStart {
  public start(): void {
    if (this.game.screenNumber === 1) {
      this.instantiate({
        entity: Spaceship,
        components: [
          Transform,
          Rigidbody,
          AvoidOverflow,
          Input,
          SocketUpdateTransform,
        ],
      })
    } else {
      this.instantiate({
        entity: SpaceshipVirtual,
        components: [Transform, AvoidOverflow, SocketUpdateTransform],
      })
    }
  }
}
