import {
  abs,
  AbstractComponent,
  Component,
  IDraw,
  IOnAwake,
} from '@asteroidsjs'

import { Drawer } from './drawer.component'
import { Transform } from './transform.component'

import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Class that represents the component responsible for rendering the
 * entity.
 */
@Component({
  required: [Transform, Drawer],
})
export class Health extends AbstractComponent implements IOnAwake, IDraw {
  /**
   * Property that defines the current health of an entity.
   *
   * @default 100
   */
  private _health = new BehaviorSubject<number>(100)

  public transform: Transform

  /**
   * Property that defines the max health of an entity.
   *
   * @default 100
   */
  public maxHealth = 100

  /**
   * Property that defines the health bar color.
   */
  public color = ''

  /**
   * Property that defines the health bar length.
   */
  public size = 50

  /**
   * Property that defines the health bar opacity.
   */
  private opacity = 0

  /**
   * An observable that is triggered every time the health is updated.
   */
  public get health$(): Observable<number> {
    return this._health.asObservable()
  }

  public get health(): number {
    return this._health.value
  }

  public set health(value: number) {
    this._health.next(value)
  }

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  public draw(): void {
    if (this.health >= this.maxHealth) {
      this.opacity = this.opacity - 0.1 < 0 ? 0 : this.opacity - 0.1
    } else {
      this.opacity = this.opacity + 0.1 > 1 ? 1 : this.opacity + 0.1
    }

    if (this.opacity === 0) {
      return
    }

    this.getContexts()[0].translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )

    const x =
      0 -
      this.transform.dimensions.width / 2 +
      abs(this.transform.dimensions.width - this.size) / 2

    const y = this.transform.dimensions.height / 2 + 20

    this.getContexts()[0].beginPath()
    this.getContexts()[0].fillStyle = this.color || '#ffffff'
    this.getContexts()[0].globalAlpha = 0.35 * this.opacity
    this.getContexts()[0].rect(x, y, this.size, 4)
    this.getContexts()[0].fill()
    this.getContexts()[0].globalAlpha = this.opacity
    this.getContexts()[0].closePath()

    this.getContexts()[0].beginPath()
    this.getContexts()[0].rect(
      x,
      y,
      (this.health / this.maxHealth) * this.size,
      4,
    )
    this.getContexts()[0].fill()
    this.getContexts()[0].globalAlpha = 1
    this.getContexts()[0].closePath()

    this.getContexts()[0].translate(
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
