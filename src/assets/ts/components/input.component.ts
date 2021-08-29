import { AbstractComponent } from '../engine/abstract-component'
import { Component } from '../engine/decorators/component.decorator'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Vector2 } from '../engine/math/vector2'
import { IGameKeys } from '../interfaces/input.interface'
import { ISpaceship } from '../interfaces/spaceship.interface'
import { Rigidbody } from './rigidbody.component'
import { fromEvent } from 'rxjs'

/**
 * Class that represents the component that allows  the user interaction
 * with the game
 */
@Component({
  required: [Rigidbody],
})
export class Input
  extends AbstractComponent
  implements IOnAwake, IOnStart, IOnLoop
{
  /**
   * Property that contains the pressed keys and whether they are pressed
   * or not.
   *
   * @example
   * {
   *   'up': true,
   *   'left': true,
   *   'right': false,
   *   'down': false,
   *   'shoot': false
   * }
   *
   * @default {}
   */
  private gameKeys: IGameKeys = {}

  /**
   * Property that represents the controlled spaceship.
   */
  private spaceship: ISpaceship

  /**
   * Property that represents the controlled entity's rigidbody.
   */
  private rigidbody: Rigidbody

  public onAwake(): void {
    this.spaceship = this.entity as unknown as ISpaceship
    this.rigidbody = this.getComponent(Rigidbody)
  }

  public onStart(): void {
    this.keyPressed()
  }

  /**
   * Captures the pressed key and checks the corresponding action
   */
  public keyPressed(): void {
    fromEvent(window, 'keydown').subscribe((e: KeyboardEvent) => {
      this.setGameKeyPressed(e.code, true)
    })

    fromEvent(window, 'keyup').subscribe((e: KeyboardEvent) => {
      this.setGameKeyPressed(e.code, false)
    })
  }

  /**
   * Function that realize the player moves.
   *
   * @param key - String that represents the pressed key.
   * @param isPressed - Whether the key is pressed or not.
   */
  private setGameKeyPressed(key: string, isPressed: boolean): void {
    switch (key) {
      case 'KeyW':
      case 'ArrowUp':
        this.gameKeys['up'] = isPressed
        break

      case 'KeyA':
      case 'ArrowLeft':
        this.gameKeys['left'] = isPressed
        break

      case 'KeyS':
      case 'ArrowDown':
        this.gameKeys['down'] = isPressed
        break

      case 'KeyD':
      case 'ArrowRight':
        this.gameKeys['right'] = isPressed
        break

      case 'Space':
      case 'ShiftRight':
        this.gameKeys['shoot'] = isPressed
        break
    }
  }

  public onLoop(): void {
    if (
      !Object.entries(this.gameKeys)
        .filter((item) => item[0] === 'left' || item[0] === 'right')
        .map((item) => item[1])
        .reduce((prev, cur) => prev || cur, false)
    ) {
      this.rigidbody.angularVelocity = 0
      this.rigidbody.angularResultant = 0
    }

    if (this.gameKeys['shoot'] && !this.spaceship.isShooting) {
      this.spaceship.isShooting = true
    } else if (!this.gameKeys['shoot'] && this.spaceship.isShooting) {
      this.spaceship.isShooting = false
    }

    if (this.spaceship.isShooting) {
      this.spaceship.shoot()
    }

    if (this.gameKeys['up']) {
      this.rigidbody.resultant = Vector2.sum(
        this.rigidbody.resultant,
        Vector2.multiply(this.spaceship.direction, this.spaceship.force),
      )
    }
    if (this.gameKeys['right']) {
      this.rigidbody.angularResultant += this.spaceship.angularForce

      if (this.gameKeys['left']) {
        this.rigidbody.angularResultant = 0
      }
    }
    if (this.gameKeys['left']) {
      this.rigidbody.angularResultant += -this.spaceship.angularForce

      if (this.gameKeys['right']) {
        this.rigidbody.angularResultant = 0
      }
    }
  }
}