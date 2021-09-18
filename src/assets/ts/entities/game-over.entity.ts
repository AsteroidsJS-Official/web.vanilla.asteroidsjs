import {
  AbstractEntity,
  Entity,
  getHtml,
  IOnAwake,
  IOnStart,
} from '@asteroidsjs'

import { LGSocketService } from '../services/lg-socket.service'

import { GameService } from '../services/game.service'
import { UserService } from '../services/user.service'

import { Menu } from '../scenes/menu.scene'
import { Single } from '../scenes/single.scene'

/**
 * Class that represents the game over entity that is shown
 * after the user death.
 */
@Entity({
  services: [GameService, LGSocketService, UserService],
})
export class GameOver extends AbstractEntity implements IOnAwake, IOnStart {
  private lgSocketService: LGSocketService

  private userService: UserService

  private gameService: GameService

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
    this.userService = this.getService(UserService)
    this.gameService = this.getService(GameService)
  }

  onStart(): void {
    document.querySelector('ast-score')?.remove()
    this.insertGameOverHtml()

    if (this.lgSocketService.screen?.number !== 1) {
      this.lgSocketService.on<string>('change-scene').subscribe((scene) => {
        if (scene === 'single') {
          this.loadSinglePlayer()
        } else if (scene === 'menu') {
          this.loadMenu()
        }
      })
    }
  }

  private async insertGameOverHtml(): Promise<void> {
    const html = await getHtml('game-over', 'ast-game-over')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'

    document.body.appendChild(html)

    if (this.lgSocketService.screen?.number === 1) {
      document.querySelector('.game-over-container')?.classList.remove('hide')

      const score = document.querySelector('ast-game-over .score .amount')

      if (score) {
        score.innerHTML = this.userService.score.toString()
      }

      const respawnButton = document.querySelector('.respawn-button')
      const backButton = document.querySelector('.back-button')

      if (respawnButton && backButton) {
        respawnButton.addEventListener('click', () => {
          this.lgSocketService.emit('change-scene', 'single')

          this.loadSinglePlayer()
        })

        backButton.addEventListener('click', () => {
          this.lgSocketService.emit('change-scene', 'menu')

          this.loadMenu()
        })
      }
    }
  }

  private loadSinglePlayer(): void {
    this.gameService.gameOver = false
    this.scene.unload(this.scene)
    document.querySelector('ast-game-over')?.remove()

    this.scene.load(Single)
  }

  private loadMenu(): void {
    this.gameService.gameOver = false
    this.scene.unload(this.scene)
    document.querySelector('ast-game-over')?.remove()

    this.scene.load(Menu)
  }
}
