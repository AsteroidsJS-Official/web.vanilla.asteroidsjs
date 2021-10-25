import { AbstractComponent, Component, IOnStart } from '@asteroidsjs'

import { Spaceship } from '../../spaceship/entities/spaceship.entity'

/**
 * Class that represents the repair power up that can be applied to
 * spaceships.
 */
@Component()
export class Repair extends AbstractComponent implements IOnStart {
  /**
   * Property that defines the amount of health to be healed.
   */
  repairAmount: number

  onStart(): void {
    this.getEntityAs<Spaceship>().health.heal(this.repairAmount)
    this.destroy(this)
  }
}
