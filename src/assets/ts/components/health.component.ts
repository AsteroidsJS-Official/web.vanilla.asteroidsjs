import { AbstractComponent, Component, IDraw, IOnStart } from '@asteroidsjs'

import { Drawer } from './drawer.component'
import { Transform } from './transform.component'

/**
 * Class that represents the component responsible for rendering the
 * entity
 */
@Component({
  required: [Transform, Drawer],
})
export class Health extends AbstractComponent implements IOnStart, IDraw {
  public transform: Transform

  /**
   * Property that difines the max health of an entity.
   *
   * @default 100
   */
  public maxHealth = 100

  /**
   * Property that difines the current health of an entity.
   *
   * @default 100
   */
  public health = 100

  /**
   * Property that difines the health bar color.
   */
  public color = ''

  /**
   * Property that defines the health bar opacity.
   */
  private opacity = 0

  public onStart(): void {
    this.transform = this.getComponent(Transform)
  }

  public draw(): void {
    if (this.health >= this.maxHealth) {
      this.opacity = this.opacity - 0.1 < 0 ? 0 : this.opacity - 0.1
    } else {
      this.opacity = this.opacity + 0.1 > 1 ? 1 : this.opacity + 0.1
    }

    this.getContext().translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )

    this.getContext().beginPath()
    this.getContext().fillStyle = this.color || '#ffffff'
    this.getContext().globalAlpha = 0.35 * this.opacity
    this.getContext().rect(
      0 - this.transform.dimensions.width / 2,
      this.transform.dimensions.height / 2 + 20,
      50,
      4,
    )
    this.getContext().fill()
    this.getContext().globalAlpha = this.opacity
    this.getContext().closePath()

    this.getContext().beginPath()
    this.getContext().rect(
      0 - this.transform.dimensions.width / 2,
      this.transform.dimensions.height / 2 + 20,
      (this.health / this.maxHealth) * 50,
      4,
    )
    this.getContext().fill()
    this.getContext().globalAlpha = 1
    this.getContext().closePath()

    this.getContext().translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  /**
   * Subtracts the current entity health according to the damage received.
   *
   * @param damage The amount of damage that the entity will receive.
   * @returns The remaining health of the entity.
   */
  public hurt(damage = 5): number {
    this.health = this.health - damage < 0 ? 0 : this.health - damage
    return this.health
  }

  /**
   * Adds life to the current entity health according to the life received.
   *
   * @param damage The amount of life that the entity will receive.
   * @returns The current health of the entity.
   */
  public heal(amount = 5): number {
    this.health =
      this.health + amount > this.maxHealth
        ? this.maxHealth
        : this.health + amount
    return this.health
  }
}
