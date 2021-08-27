import { Entity } from '../engine/core/entity'
import { IOnStart } from '../engine/core/interfaces/on-start.interface'

/**
 * Class that represents the first entity to be loaded into the game
 */
export class Manager extends Entity implements IOnStart {
  public onStart(): void {
    // if (this.game.screenNumber === 1) {
    //   this.instantiate({
    //     entity: Spaceship,
    //     components: [
    //       Transform,
    //       Rigidbody,
    //       RenderOverflow,
    //       Input,
    //       SocketUpdateTransform,
    //     ],
    //   })
    // } else {
    //   this.instantiate({
    //     entity: SpaceshipVirtual,
    //     components: [Transform, RenderOverflow, SocketUpdateTransform],
    //   })
    // }
  }
}
