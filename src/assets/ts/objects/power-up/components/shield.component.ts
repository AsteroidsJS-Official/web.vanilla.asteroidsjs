import { AbstractComponent, Component, IOnAwake, IOnStart } from '@asteroidsjs'

import { Spaceship } from '../../spaceship/entities/spaceship.entity'
import { Shield as ShieldEntity } from './../entities/shield.entity'

import { Transform } from '../../../shared/components/transform.component'

/**
 * Class that represents the shield power up that can be applied to
 * spaceships.
 */
@Component({
  required: [Transform],
})
export class Shield extends AbstractComponent implements IOnAwake, IOnStart {
  transform: Transform

  /**
   * Property that defines the amount of health to be healed.
   */
  radius: number

  /**
   * Property that defines the shield health.
   */
  shieldHealth: number

  /**
   * Property that defines the duration of the shield.
   */
  duration: number

  private shieldEnt: ShieldEntity

  onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  onStart(): void {
    this.shieldEnt = this.instantiate({
      entity: ShieldEntity,
      use: {
        userId: (this.entity as Spaceship).userId,
        tag: ShieldEntity.name,
        radius: this.radius,
        shieldHealth: this.shieldHealth,
        duration: this.duration,
      },
      components: [
        {
          id: '__shield_transform__',
          use: {
            parent: this.transform,
          },
        },
      ],
    })
  }

  /**
   * Increases the duration of the current shield.
   *
   * @param amount The amount to be increased.
   */
  increaseDuration(amount: number): void {
    this.duration += amount

    if (this.shieldEnt) {
      this.shieldEnt.duration += amount
    }
  }
}
