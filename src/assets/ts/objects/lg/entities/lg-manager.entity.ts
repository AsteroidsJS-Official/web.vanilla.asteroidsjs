import {
  AbstractEntity,
  destroyMultipleElements,
  Entity,
  IOnAwake,
  IOnDestroy,
  IOnStart,
} from '@asteroidsjs'

import { LGSocketService } from '../../../shared/services/lg-socket.service'
import { SocketService } from '../../../shared/services/socket.service'

import { GameService } from '../../../shared/services/game.service'

import { Menu } from '../../../scenes/menu.scene'

/**
 * Entity responsible for managing the screen socket connection.
 */
@Entity({
  services: [GameService, LGSocketService, SocketService],
})
export class LGManager
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private gameService: GameService

  private lgSocketService: LGSocketService

  private socketService: SocketService

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
    this.socketService = this.getService(SocketService)
    this.gameService = this.getService(GameService)
  }

  onStart(): void {
    this.lgSocketService.loadScreens().subscribe(() => {
      this.autoConnect()
    })
  }

  onDestroy(): void {
    destroyMultipleElements('ast-lg-screen-slave')
    destroyMultipleElements('ast-lg-screen')
  }

  /**
   * Automatically connects a screen depending on its data and params.
   */
  private autoConnect(): void {
    const localScreenNumber = this.lgSocketService.getLocalScreenNumber()

    let screenExists = false
    let isScreenConnected = false

    if (localScreenNumber) {
      const screen = this.lgSocketService.getScreenByNumber(localScreenNumber)
      screenExists = !!screen
      isScreenConnected = !!screen?.isConnected
    }

    if (screenExists && !isScreenConnected) {
      this.connect(localScreenNumber)
    } else if (
      !this.lgSocketService.isMasterConnected &&
      (!localScreenNumber || localScreenNumber === 1)
    ) {
      this.connect(1)
    } else {
      this.socketService
        .emit<unknown, boolean>('check-connection-waiting', {})
        .subscribe((isMasterWaiting: boolean) => {
          if (isMasterWaiting) {
            this.connect()
          }
        })
    }
  }

  /**
   * Connects a screen to the socket.
   *
   * @param screenNumber The screen number to connect.
   */
  private connect(screenNumber?: number): void {
    this.lgSocketService.connectScreen(screenNumber).subscribe((screen) => {
      this.setScreenPath(screen.number)

      this.lgSocketService.getGameStatus().subscribe((isInGame) => {
        if (isInGame) {
          this.gameService.isInGame = true

          this.scene.unload(this.scene)
          this.scene.load(Menu)
        }
      })
    })
  }

  /**
   * Sets the window path according to the current screen number.
   *
   * @param screenNumber The screen number.
   */
  private setScreenPath(screenNumber: number): void {
    window.history.pushState({}, '', '/screen/' + screenNumber)
  }
}
