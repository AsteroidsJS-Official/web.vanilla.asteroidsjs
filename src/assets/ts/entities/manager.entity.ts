import { SocketUpdateTransform } from '../engine/components/socket-update-transform.component'

import { Collider2 } from '../engine/components/collider2.component'
import { Input } from '../engine/components/input.component'
import { RenderOverflow } from '../engine/components/render-overflow.component'
import { Rigidbody } from '../engine/components/rigidbody.component'
import { Transform } from '../engine/components/transform.component'
import { Entity } from '../engine/core/entity'
import { IStart } from '../engine/interfaces/start.interface'
import { Spaceship } from './spaceship.entity'

/**
 * Class that represents the first entity to be loaded into the game
 */
export class Manager extends Entity implements IStart {
  public start(): void {
    // this.instantiate({
    //   entity: Meteor,
    //   components: [Transform, Rigidbody, AvoidOverflow],
    // })

    this.instantiate({
      entity: Spaceship,
      components: [
        Transform,
        Rigidbody,
        RenderOverflow,
        Input,
        SocketUpdateTransform,
      ],
    })
    // if (this.game.screenNumber === 1) {
    // } else {
    //   this.instantiate({
    //     entity: SpaceshipVirtual,
    //     components: [Transform, AvoidOverflow, SocketUpdateTransform],
    //   })
    // }
  }
}
