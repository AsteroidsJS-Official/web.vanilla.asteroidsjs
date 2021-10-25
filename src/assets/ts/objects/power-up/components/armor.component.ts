import { AbstractComponent, Component, IOnStart } from '@asteroidsjs'

import { Spaceship } from '../../spaceship/entities/spaceship.entity'

/**
 * Class that represents the armor power up that can be applied to
 * spaceships.
 */
@Component()
export class Armor extends AbstractComponent implements IOnStart {
  /**
   * Property that defines the amount of health to be increased.
   */
  increasingAmount: number

  /**
   * Property that defines the amount of seconds that the armor
   * will last.
   */
  duration: number

  onStart(): void {
    const spaceship = this.getEntityAs<Spaceship>()

    spaceship.health.maxHealth += this.increasingAmount
    spaceship.health.heal(this.increasingAmount)

    setTimeout(() => {
      spaceship.health.maxHealth -= this.increasingAmount
      spaceship.health.health = spaceship.health.maxHealth

      this.destroy(this)
    }, this.duration * 1000)
  }
}
