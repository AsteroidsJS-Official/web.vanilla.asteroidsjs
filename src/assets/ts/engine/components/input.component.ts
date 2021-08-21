import { IGameKeys } from '../../interfaces/input.interface'
import { ISpaceship } from '../../interfaces/spaceship.interface'
import { Component } from '../core/component'
import { IStart } from '../interfaces/start.interface'
import { Vector2 } from '../math/vector2'
import { Rigidbody } from './rigidbody.component'
import { fromEvent } from 'rxjs'

export class Input extends Component implements IStart {
  private gameKeys: IGameKeys = {}
  private spaceship: ISpaceship
  private rigidbody: Rigidbody

  public start(): void {
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
      this.setGameKeyPressed(e.key, true)
      this.move()
    })

    fromEvent(window, 'keyup').subscribe((e: KeyboardEvent) => {
      this.setGameKeyPressed(e.key, false)
      this.move()
    })
  }

  /**
   * Function that realize the player moves
   * @param key string that represents the key pressed
   */
  private setGameKeyPressed(key: string, isPreseed: boolean): void {
    switch (key) {
      case 'W':
      case 'ArrowUp':
        this.gameKeys['up'] = isPreseed
        break

      case 'A':
      case 'ArrowLeft':
        this.gameKeys['left'] = isPreseed
        break

      case 'S':
      case 'ArrowDown':
        this.gameKeys['down'] = isPreseed
        break

      case 'D':
      case 'ArrowRight':
        this.gameKeys['right'] = isPreseed
        break
    }
  }

  private move(): void {
    if (
      !Object.entries(this.gameKeys)
        .map((item) => item[1])
        .reduce((prev, cur) => prev || cur)
    ) {
      this.rigidbody.resultant = new Vector2()
      this.rigidbody.angularResultant = 0
      return
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
      }
      if (this.gameKeys[key] && key === 'left') {
        this.rigidbody.angularResultant += -this.spaceship.angularForce
      }
    }
  }
}
