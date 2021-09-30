import {
  AbstractEntity,
  appendChildren,
  createElement,
  destroyMultipleElements,
  Entity,
  getElement,
  getHtml,
  getMultipleElements,
  IOnAwake,
  IOnDestroy,
  IOnStart,
  removeClass,
} from '@asteroidsjs'

import { LGSocketService } from '../../../shared/services/lg-socket.service'
import { SocketService } from '../../../shared/services/socket.service'

import { GameService } from '../../../shared/services/game.service'
import { MultiplayerService } from '../../../shared/services/multiplayer.service'
import { UserService } from '../../../shared/services/user.service'

import { isMobile } from '../../../utils/platform'

import { Joystick } from '../../../scenes/joystick.scene'
import { Menu } from '../../../scenes/menu.scene'
import { Single } from '../../../scenes/single.scene'
import { Subscription } from 'rxjs'

/**
 * Class that represents the game over entity that is shown
 * after the user death.
 */
@Entity({
  services: [
    GameService,
    LGSocketService,
    UserService,
    SocketService,
    MultiplayerService,
  ],
})
export class GameOver
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private lgSocketService: LGSocketService

  private socketService: SocketService

  private userService: UserService

  private gameService: GameService

  private multiplayerService: MultiplayerService

  private sceneSubscription: Subscription

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
    this.socketService = this.getService(SocketService)
    this.userService = this.getService(UserService)
    this.gameService = this.getService(GameService)
    this.multiplayerService = this.getService(MultiplayerService)
  }

  onStart(): void {
    if (this.lgSocketService.screen?.number === 1 || isMobile) {
      this.insertGameOverHtml()
    } else {
      this.insertSlaveGameOverHtml()
    }

    this.sceneSubscription = this.socketService
      .on<string>('change-scene')
      .subscribe((scene) => {
        if (scene === 'single') {
          if (isMobile) {
            this.loadJoystick()
          } else {
            this.loadSinglePlayer()
          }
        } else if (scene === 'menu') {
          this.loadMenu()
        } else if ((scene = 'joystick')) {
          this.loadJoystick()
        }
      })
  }

  onDestroy(): void {
    destroyMultipleElements('ast-game-over')
    destroyMultipleElements('.overlay')

    this.gameService.gameOver = false
    this.sceneSubscription?.unsubscribe()
  }

  private async insertGameOverHtml(): Promise<void> {
    destroyMultipleElements('ast-score')
    getMultipleElements('canvas').forEach((canvas) => {
      canvas.style.pointerEvents = 'none'
    })

    const html = await getHtml('game-over', 'ast-game-over')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'

    appendChildren(document.body, html)

    removeClass('.game-over-container', 'hide')

    const score = getElement('ast-game-over .score .amount')

    if (score) {
      score.innerHTML = this.userService.score.toString()
    }

    const respawnButton = getElement<HTMLButtonElement>('.respawn-button')
    const backButton = getElement<HTMLButtonElement>('.back-button')

    if (!(respawnButton && backButton)) {
      return
    }

    respawnButton.addEventListener('click', () => {
      getMultipleElements('canvas').forEach((canvas) => {
        canvas.style.pointerEvents = 'unset'
      })

      if (this.gameService.isConnectedToRoom) {
        this.multiplayerService.respawn(this.userService.userId)
        this.loadJoystick()
      } else {
        this.lgSocketService.changeScene('single')
      }
    })

    backButton.addEventListener('click', () => {
      if (this.gameService.isConnectedToRoom) {
        this.multiplayerService.disconnectMe()

        if (this.userService.isMaster) {
          this.lgSocketService.changeScene('menu')
        } else {
          this.loadMenu()
        }
      } else {
        this.lgSocketService.changeScene('menu')
      }
    })
  }

  private insertSlaveGameOverHtml(): void {
    destroyMultipleElements('.overlay')

    const div = createElement('div')
    div.classList.add('overlay')

    appendChildren(document.body, div)
  }

  private loadSinglePlayer(): void {
    this.scene.unload(this.scene)
    this.scene.load(Single)
  }

  private loadMenu(): void {
    this.scene.unload(this.scene)
    this.scene.load(Menu)
  }

  private loadJoystick(): void {
    this.scene.unload(this.scene)
    this.scene.load(Joystick)
  }
}
