import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { SpaceshipVirtual } from './spaceship-virtual.entity'
import { Spaceship } from './spaceship.entity'

/**
 * Class that represents the first entity to be loaded into the game
 */
@Entity()
export class Manager extends AbstractEntity implements IOnStart {
  public onStart(): void {
    if (this.game.getScreen().number === 1) {
      this.instantiate({ entity: Spaceship })
    } else {
      this.instantiate({ entity: SpaceshipVirtual })
    }
  }
}
