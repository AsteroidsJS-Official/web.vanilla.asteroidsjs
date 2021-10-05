import {
  AbstractComponent,
  Component,
  IOnAwake,
  IOnLoop,
  IOnStart,
  Vector2,
} from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import { Spaceship } from '../entities/spaceship.entity'

import { GameService } from '../../../shared/services/game.service'
import { UserService } from '../../../shared/services/user.service'

import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'

import { IJoystickActions } from '../../../shared/interfaces/joystick.interface'
import { IGameKeys } from '../interfaces/input.interface'

import { fromEvent } from 'rxjs'

/**
 * Class that represents the component that allows  the user interaction
 * with the game.
 */
@Component({
  required: [Rigidbody],
  services: [GameService, SocketService, UserService],
})
export class Input
  extends AbstractComponent
  implements IOnAwake, IOnStart, IOnLoop
{
  private gameService: GameService

  private socketService: SocketService

  private userService: UserService

  /**
   * Property that represents the joystick controller actions.
   */
  private actions: IJoystickActions

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
   * Property that represents the controlled entity's rigidbody.
   */
  private rigidbody: Rigidbody

  /**
   * Property that defines the controller spaceship.
   */
  private spaceship: Spaceship

  /**
   * Property that defines the acceleration force.
   */
  public force: number

  /**
   * Property that defines the angular acceleration force.
   */
  public angularForce: number

  onAwake(): void {
    this.spaceship = this.getEntityAs<Spaceship>()
    this.rigidbody = this.getComponent(Rigidbody)

    this.gameService = this.getService(GameService)
    this.socketService = this.getService(SocketService)
    this.userService = this.getService(UserService)
  }

  onStart(): void {
    if (
      !this.gameService.isInLocalMPGame ||
      this.spaceship.joystickId === this.userService.userId
    ) {
      this.listenKeys()
    }

    this.socketService
      .on<{ isMaster: boolean; userId: string; actions: IJoystickActions }>(
        'update-actions',
      )
      .subscribe((data) => {
        if (
          !data.isMaster &&
          this.spaceship.joystickId &&
          data.userId !== this.spaceship.joystickId
        ) {
          return
        }

        this.actions = data.actions

        if (data.actions.rotating === 'right') {
          this.setGameKeyPressed('ArrowRight', true)
          this.setGameKeyPressed('ArrowLeft', false)
        } else if (data.actions.rotating === 'left') {
          this.setGameKeyPressed('ArrowRight', false)
          this.setGameKeyPressed('ArrowLeft', true)
        } else {
          this.setGameKeyPressed('ArrowRight', false)
          this.setGameKeyPressed('ArrowLeft', false)
        }
      })
  }

  /**
   * Captures the pressed key and checks the corresponding action.
   */
  public listenKeys(): void {
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
        .reduce((prev, cur) => prev || cur, false) &&
      (!this.actions || !this.actions.rotating)
    ) {
      this.rigidbody.angularVelocity = 0
      this.rigidbody.angularResultant = 0
    }

    if (
      ((this.actions && this.actions.isShooting) || this.gameKeys['shoot']) &&
      !this.spaceship.isShooting
    ) {
      this.spaceship.isShooting = true
    } else if (
      (!this.actions || !this.actions.isShooting) &&
      !this.gameKeys['shoot'] &&
      this.spaceship.isShooting
    ) {
      this.spaceship.isShooting = false
    }

    if (this.spaceship.isShooting) {
      this.spaceship.shoot()
    }

    if (this.gameKeys['up'] || (this.actions && this.actions.isBoosting)) {
      this.rigidbody.resultant = Vector2.sum(
        this.rigidbody.resultant,
        Vector2.multiply(this.spaceship.direction, this.force),
      )
    }

    // FIXME: Fix infinite angular resultant
    if (this.gameKeys['right']) {
      this.rigidbody.angularResultant += this.angularForce
      // this.rigidbody.angularVelocity = this.rigidbody.maxAngularVelocity

      if (this.gameKeys['left']) {
        this.rigidbody.angularResultant = 0
      }
    }
    if (this.gameKeys['left']) {
      this.rigidbody.angularResultant += -this.angularForce
      // this.rigidbody.angularVelocity = -this.rigidbody.maxAngularVelocity

      if (this.gameKeys['right']) {
        this.rigidbody.angularResultant = 0
      }
    }
  }
}
