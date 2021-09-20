import { AbstractEntity, Entity, IOnAwake } from '@asteroidsjs'

import { LGSocketService } from '../../../shared/services/lg-socket.service'

/**
 * Entity responsible for managing the screen socket connection.
 */
@Entity({
  services: [LGSocketService],
})
export class LGManager extends AbstractEntity implements IOnAwake {
  private lgSocketService: LGSocketService

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
  }

  onStart(): void {
    this.lgSocketService.loadScreens().subscribe(() => {
      this.autoConnect()
    })
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
    } else if (!this.lgSocketService.isMasterConnected) {
      this.connect(1)
    } else {
      this.lgSocketService
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
