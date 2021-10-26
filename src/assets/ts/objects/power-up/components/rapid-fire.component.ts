import { AbstractComponent, Component, IOnStart } from '@asteroidsjs'

import { Spaceship } from '../../spaceship/entities/spaceship.entity'

/**
 * Class that represents the armor power up that can be applied to
 * spaceships.
 */
@Component()
export class RapidFire extends AbstractComponent implements IOnStart {
  /**
   * Property that defines the amount of times to increate the
   * spaceship fire rate.
   */
  shootingSpeed: number

  /**
   * Property that defines the amount of seconds that the rapid
   * fire will last.
   */
  duration: number

  onStart(): void {
    const spaceship = this.getEntityAs<Spaceship>()

    spaceship.fireRate /= this.shootingSpeed

    setTimeout(() => {
      spaceship.fireRate *= this.shootingSpeed

      this.destroy(this)
    }, this.duration * 1000)
  }
}
