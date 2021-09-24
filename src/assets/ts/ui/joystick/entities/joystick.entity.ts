import {
  AbstractEntity,
  addClass,
  appendChildren,
  destroyMultipleElements,
  Entity,
  getElement,
  getHtml,
  IOnAwake,
  IOnDestroy,
  IOnStart,
  removeClass,
} from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import { GameOver } from '../../game-over/entities/game-over.entity'

import { UserService } from '../../../shared/services/user.service'

import { IJoystickActions } from '../../../shared/interfaces/joystick.interface'
import { IPlayer } from '../../../shared/interfaces/player.interface'

import nipplejs, { JoystickManager } from 'nipplejs'
import { Subscription } from 'rxjs'

/**
 * Class that represents the player joystick controller and its behavior.
 */
@Entity({
  services: [SocketService, UserService],
})
export class Joystick
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private socketService: SocketService

  private userService: UserService

  /**
   * Property that defines the analog controller manager.
   */
  private joystickManager: JoystickManager

  /**
   * Property responsible for keeping the game over subscription.
   */
  private gameOverSubscription: Subscription

  /**
   * Property that defines whether the boost lock button is active.
   */
  private isBoostLocked = false

  /**
   * Property that defines the joystick actions status.
   */
  private actions: IJoystickActions = {
    isShooting: false,
    isBoosting: false,
    activatedSkill: false,
    rotating: null,
  }

  onAwake(): void {
    this.socketService = this.getService(SocketService)
    this.userService = this.getService(UserService)
  }

  onStart(): void {
    this.insertJoystickHtml()

    this.gameOverSubscription = this.socketService
      .on<IPlayer>('game-over')
      .subscribe((player) => {
        this.userService.setScore(player.score)
        destroyMultipleElements('ast-joystick')
        this.instantiate({ entity: GameOver })
      })
  }

  onDestroy(): void {
    this.gameOverSubscription.unsubscribe()
  }

  /**
   * Inserts the joystick HTML into the body element.
   */
  private async insertJoystickHtml(): Promise<void> {
    const html = await getHtml('joystick', 'ast-joystick')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'

    appendChildren(document.body, html)

    this.configureJoystick()
    this.listenForEvents()
  }

  /**
   * Creates and configures the joystick manager using NippleJS.
   */
  private configureJoystick(): void {
    const zone = getElement('.analog-region')

    if (!zone) {
      return
    }

    this.joystickManager = nipplejs.create({
      color: '#48bdff',
      lockX: true,
      restOpacity: 0.8,
      catchDistance: 300,
      position: {
        bottom: '150px',
        left: '170px',
      },
      mode: 'static',
      zone,
    })
  }

  /**
   * Listens for DOM events, such as button pressure or analog direction.
   */
  private listenForEvents(): void {
    const shootButton = getElement<HTMLButtonElement>('.shoot-button')
    const boostButton = getElement<HTMLButtonElement>('.boost-button')
    const boostLockButton = getElement<HTMLButtonElement>('.boost-lock-button')
    const skillButton = getElement<HTMLButtonElement>('.skill-button')

    if (!(shootButton && boostButton && boostLockButton && skillButton)) {
      return
    }

    shootButton.addEventListener('touchstart', () => {
      this.actions.isShooting = true
      addClass(shootButton, 'active')
      this.emitActions()
    })

    shootButton.addEventListener('touchend', () => {
      this.actions.isShooting = false
      removeClass(shootButton, 'active')
      this.emitActions()
    })

    boostButton.addEventListener('touchstart', () => {
      removeClass(boostLockButton, 'active')
      addClass(boostButton, 'active')
      this.isBoostLocked = false

      this.actions.isBoosting = true
      this.emitActions()
    })

    boostButton.addEventListener('touchend', () => {
      this.actions.isBoosting = false
      removeClass(boostButton, 'active')
      this.emitActions()
    })

    boostLockButton.addEventListener('click', () => {
      if (!this.isBoostLocked) {
        addClass(boostLockButton, 'active')
      } else {
        removeClass(boostLockButton, 'active')
      }

      this.isBoostLocked = !this.isBoostLocked
      this.actions.isBoosting = this.isBoostLocked
      this.emitActions()
    })

    skillButton.addEventListener('click', () => {
      this.actions.activatedSkill = true
      removeClass(skillButton, 'active')
      this.emitActions()
    })

    this.joystickManager.on('dir:left', () => {
      this.actions.rotating = 'left'
      this.emitActions()
    })

    this.joystickManager.on('dir:right', () => {
      this.actions.rotating = 'right'
      this.emitActions()
    })

    this.joystickManager.on('end', () => {
      this.actions.rotating = null
      this.emitActions()
    })
  }

  /**
   * Emits to socket the current joystick actions status.
   */
  private emitActions(): void {
    this.socketService.emit('update-actions', this.actions)
    this.actions.activatedSkill = false
  }
}
