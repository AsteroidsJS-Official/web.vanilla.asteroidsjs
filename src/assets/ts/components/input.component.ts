import { Component } from '../engine/core/component'
import { IOnLoop } from '../engine/core/interfaces/on-loop.interface'
import { IOnStart } from '../engine/core/interfaces/on-start.interface'
import { Vector2 } from '../engine/core/math/vector2'
import { IGameKeys } from '../interfaces/input.interface'
import { ISpaceship } from '../interfaces/spaceship.interface'
import { Rigidbody } from './rigidbody.component'
import { fromEvent } from 'rxjs'

/**
 * Class that represents the component that allows  the user interaction
 * with the game
 */
export class Input extends Component implements IOnStart, IOnLoop {
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

  public onStart(): void {
    this.requires([Rigidbody])

    this.spaceship = this.entity as unknown as ISpaceship
    this.rigidbody = this.getComponent(Rigidbody)

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

    for (const key in this.gameKeys) {
      if (this.gameKeys[key] && key === 'up') {
        this.rigidbody.resultant = Vector2.sum(
          this.rigidbody.resultant,
          Vector2.multiply(this.spaceship.direction, this.spaceship.force),
        )
      }
      if (this.gameKeys[key] && key === 'right') {
        this.rigidbody.angularResultant += this.spaceship.angularForce

        if (this.gameKeys['left']) {
          this.rigidbody.angularResultant = 0
        }
      }
      if (this.gameKeys[key] && key === 'left') {
        this.rigidbody.angularResultant += -this.spaceship.angularForce

        if (this.gameKeys['right']) {
          this.rigidbody.angularResultant = 0
        }
      }
    }
  }
}
