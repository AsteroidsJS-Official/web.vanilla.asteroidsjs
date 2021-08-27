import { SocketUpdateTransform } from '../components/socket-update-transform.component'

import { Input } from '../components/input.component'
import { RenderOverflow } from '../components/render-overflow.component'
import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'
import { Entity } from '../engine/entity'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { SpaceshipVirtual } from './spaceship-virtual.entity'
import { Spaceship } from './spaceship.entity'

/**
 * Class that represents the first entity to be loaded into the game
 */
export class Manager extends Entity implements IOnStart {
  public onStart(): void {
    if (this.game.getScreen().number === 1) {
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
    } else {
      this.instantiate({
        entity: SpaceshipVirtual,
        components: [Transform, RenderOverflow, SocketUpdateTransform],
      })
    }
  }
}
