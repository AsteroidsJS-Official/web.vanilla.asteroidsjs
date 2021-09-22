import {
  AbstractEntity,
  destroyMultipleElements,
  Entity,
  getHtml,
  IOnAwake,
  IOnDestroy,
  IOnStart,
  IScreen,
} from '@asteroidsjs'

import {
  LGSocketService,
  LoadScreensData,
} from '../../../shared/services/lg-socket.service'
import { SocketService } from '../../../shared/services/socket.service'

import { Menu } from '../../../scenes/menu.scene'

/**
 * Entity responsible for creating and managing the screen selection
 * and connection menu.
 */
@Entity({
  services: [LGSocketService, SocketService],
})
export class LGScreenMenu
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private lgSocketService: LGSocketService

  private socketService: SocketService

  /**
   * Property that represents the screen elements.
   */
  private screens: HTMLDivElement[] = []

  /**
   * Property that defines the max screen angle.
   */
  private readonly maxAngle = 45

  /**
   * Property that defines the screen width.
   */
  private readonly screenWidth = 60

  /**
   * Property that defines the screens colors.
   */
  private readonly colors = [
    '--ast-lg-blue',
    '--ast-lg-red',
    '--ast-lg-yellow',
    '--ast-lg-green',
  ]

  /**
   * Property that defines the connection timeout.
   */
  private connectionTimeout: NodeJS.Timeout

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
    this.socketService = this.getService(SocketService)
  }

  onStart(): void {
    this.lgSocketService.screen$.subscribe((screen) => {
      if (screen?.number === 1) {
        this.insertMasterHtml()

        this.socketService
          .on<IScreen>('slave-connected')
          .subscribe((screen) => {
            console.log(screen.number + ' connected!')

            this.lgSocketService.addScreen(screen)
            this.updateScreensStatus()
          })

        this.socketService
          .on<number>('slave-disconnected')
          .subscribe((screenNumber) => {
            console.log(screenNumber + ' disconnected!')

            this.lgSocketService.disconnectScreen(screenNumber)
            this.updateScreensStatus()
          })
      } else if (screen) {
        this.insertSlaveHtml().then(() => {
          document.querySelector('.waiting-info.title')?.classList.add('hide')
          document.querySelector('h3.waiting-info')?.classList.remove('hide')
        })

        this.socketService.on<string>('change-scene').subscribe((scene) => {
          if (scene === 'menu') {
            this.loadMenu()
          }
        })
      }
    })

    this.lgSocketService.isMasterConnected$.subscribe((isMasterConnected) => {
      if (isMasterConnected && !this.lgSocketService.screen) {
        this.insertSlaveHtml()

        this.socketService.on('waiting-connection').subscribe(() => {
          document.querySelector('.waiting-info.title')?.classList.add('hide')
          document
            .querySelector<HTMLButtonElement>('.connect-button')
            ?.classList.remove('hide')
        })

        this.socketService.on('cancel-connection').subscribe(() => {
          document.querySelector('h3.waiting-info')?.classList.add('hide')
          document
            .querySelector<HTMLButtonElement>('.connect-button')
            ?.classList.add('hide')
          document
            .querySelector('.waiting-info.title')
            ?.classList.remove('hide')
        })
      }
    })
  }

  onDestroy(): void {
    clearTimeout(this.connectionTimeout)
  }

  /**
   * Inserts the master screen HTML into the body.
   */
  private async insertMasterHtml(): Promise<void> {
    const html = await getHtml('lg-screen', 'ast-lg-screen')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'
    document.body.appendChild(html)

    const decreaseButton =
      document.querySelector<HTMLButtonElement>('.decrease-button')
    const increaseButton =
      document.querySelector<HTMLButtonElement>('.increase-button')
    const confirmButton =
      document.querySelector<HTMLButtonElement>('.confirm-button')

    const screenAmount =
      document.querySelector<HTMLDivElement>('.screen-amount')

    if (!(decreaseButton && increaseButton && confirmButton && screenAmount)) {
      return
    }

    decreaseButton.addEventListener('click', () => {
      this.lgSocketService.decreaseScreenAmount()
      increaseButton.classList.remove('disabled')
    })

    increaseButton.addEventListener('click', () => {
      this.lgSocketService.increaseScreenAmount()
      decreaseButton.classList.remove('disabled')
    })

    confirmButton.addEventListener('click', () => {
      this.socketService.emit(
        'set-screen-amount',
        this.lgSocketService.screenAmount,
      )
      this.waitForScreensConnection()
    })

    this.lgSocketService.screenAmount$.subscribe((amount: number) => {
      if (amount === 1) {
        decreaseButton.classList.add('disabled')
      }

      if (amount === 9) {
        increaseButton.classList.add('disabled')
      }

      screenAmount.innerHTML = amount.toString()
      this.updateScreensElements()
    })

    this.updateScreensElements()
  }

  /**
   * Inserts the slave HTML into the body.
   */
  private async insertSlaveHtml(): Promise<void> {
    const html = await getHtml('lg-screen-slave', 'ast-lg-screen-slave')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'
    document.body.appendChild(html)

    const screenSlaveEl = document.getElementsByTagName('ast-lg-screen-slave')
    for (let i = 0; i < screenSlaveEl.length - 1; i++) {
      screenSlaveEl.item(i).remove()
    }

    const connectButton =
      document.querySelector<HTMLButtonElement>('.connect-button')

    connectButton?.addEventListener('click', () => {
      this.lgSocketService.connectScreen().subscribe((screen) => {
        window.history.pushState({}, '', '/screen/' + screen.number)
      })
      connectButton.classList.add('hide')
      document.querySelector('h3.waiting-info')?.classList.remove('hide')
    })
  }

  /**
   * Updates screen elements according to the current screen amount.
   */
  private updateScreensElements(): void {
    const screensHtml = document.querySelector<HTMLDivElement>('.screens')

    if (screensHtml) {
      screensHtml.innerHTML = ''
    }

    this.screens = []

    this.lgSocketService
      .getScreenLayout(this.lgSocketService.screenAmount)
      .forEach((number, index) => {
        const screenEl = this.createScreenElement(
          `var(${this.colors[index % this.colors.length]})`,
          index,
          number,
          Math.floor(this.lgSocketService.screenAmount / 2),
        )
        this.screens.push(screenEl)
        screensHtml?.appendChild(screenEl)
      })
  }

  /**
   * Creates a screen HTML element according to it's position in the screens layout.
   *
   * @param color The screen color.
   * @param position The screen index in the screens layout.
   * @param screenNumber The screen number.
   * @param amountBySide The amount of screens in each side of master.
   * @returns A HTML element representing the screen.
   *
   * @example
   * createScreenElement('--ast-lg-blue', 2, 1, 2) => HTMLDivElement
   */
  private createScreenElement(
    color: string,
    position: number,
    screenNumber: number,
    amountBySide: number,
  ): HTMLDivElement {
    const screen = document.createElement('div')
    screen.classList.add('screen', 's' + screenNumber)

    const screensEl = document.querySelector<HTMLDivElement>('.screens')

    if (!screensEl) {
      return
    }

    const distanceToMiddle = position - amountBySide

    const angleFactor = amountBySide
    const angle = (-distanceToMiddle * this.maxAngle) / angleFactor

    screen.style.backgroundColor = color
    screen.style.width = this.screenWidth + 'px'
    screen.style.left = `calc(50% - ${this.screenWidth / 2}px)`
    screen.style.top = `calc(50% - ${(screensEl.offsetHeight / 2) * 0.7}px)`
    screen.style.transform = `perspective(400px) rotateY(${angle}deg) translateZ(-${
      amountBySide * (this.screenWidth + 24)
    }px)`

    return screen
  }

  /**
   * Animates the current page elements and stand by slave connections.
   */
  private waitForScreensConnection(): void {
    this.socketService.emit('wait-for-slaves')

    const screenAmount = this.lgSocketService.screenAmount

    const screensHtml = document.querySelector<HTMLDivElement>('.screens')
    const infoTitle = document.querySelector<HTMLElement>('.info-title')
    const amountPicker =
      document.querySelector<HTMLDivElement>('.amount-picker')
    const screenConfirmButton =
      document.querySelector<HTMLButtonElement>('.confirm-button')
    const screenCancelButton =
      document.querySelector<HTMLButtonElement>('.cancel-button')

    if (
      !(
        screensHtml &&
        infoTitle &&
        amountPicker &&
        screenConfirmButton &&
        screenCancelButton
      )
    ) {
      return
    }

    screensHtml.classList.add('waiting')

    this.screens.forEach((screen, index) => {
      const amountBySide = Math.floor(this.screens.length / 2)
      const angle = (-(index - amountBySide) * this.maxAngle) / amountBySide
      screen.style.width = this.screenWidth * 2 + 'px'
      screen.style.left = `calc(50% - ${this.screenWidth}px)`
      screen.style.transform = `perspective(400px) rotateY(${angle}deg) translateZ(-${
        amountBySide * (this.screenWidth * 2 + 44)
      }px)`
    })

    screensHtml.style.transform = `scale(${1.4 - 0.02 * screenAmount})`

    infoTitle.classList.add('hide')
    amountPicker.classList.add('hide')
    screenConfirmButton.classList.add('hide')
    screenCancelButton.classList.remove('hide')

    screenCancelButton.addEventListener('click', () => {
      clearTimeout(this.connectionTimeout)

      this.lgSocketService.cancelConnection()

      screenCancelButton.classList.add('hide')

      screensHtml.classList.remove('waiting')

      this.screens.forEach((screen, index) => {
        const amountBySide = Math.floor(this.screens.length / 2)
        const angle = (-(index - amountBySide) * this.maxAngle) / amountBySide
        screen.style.width = this.screenWidth + 'px'
        screen.style.left = `calc(50% - ${this.screenWidth / 2}px)`
        screen.style.transform = `perspective(400px) rotateY(${angle}deg) translateZ(-${
          amountBySide * (this.screenWidth + 24)
        }px)`
      })

      infoTitle.classList.remove('hide')
      amountPicker.classList.remove('hide')
      screenConfirmButton.classList.remove('hide')
    })

    this.updateScreensStatus()
  }

  /**
   * Updates the screens connection status.
   *
   * @returns An empty promise.
   */
  private async updateScreensStatus(): Promise<void> {
    const screens = [...this.lgSocketService.screens].sort(
      (s1, s2) => s1.number - s2.number,
    )

    const screensExpected = [
      ...Array(this.lgSocketService.screenAmount).keys(),
    ].map((n) => n + 1)

    let blinkingScreen = 0

    for (const screen of screensExpected) {
      const s = document.querySelector<HTMLDivElement>('.screen.s' + screen)

      if (!s) {
        return
      }

      if (
        !screens[screen - 1]?.isConnected &&
        (blinkingScreen === 0 || screen <= blinkingScreen)
      ) {
        s.classList.add('waiting')
        blinkingScreen = screen
        s.classList.remove('disconnected')
      } else {
        if (screen === blinkingScreen) {
          blinkingScreen = 0
        }
        s.classList.remove('waiting')

        if (!screens[screen - 1]?.isConnected) {
          s.classList.add('disconnected')
        } else {
          s.classList.remove('disconnected')
        }
      }
    }

    this.connectionTimeout = setTimeout(() => {
      if (
        this.lgSocketService.getScreensConnected() ===
          this.lgSocketService.screenAmount &&
        this.lgSocketService.screen.number === 1
      ) {
        this.socketService
          .emit('get-screens')
          .subscribe((data: LoadScreensData) => {
            if (!data) {
              return
            }

            this.lgSocketService.screens = data.screens

            this.lgSocketService.changeScene('menu')

            destroyMultipleElements('ast-lg-screen')
            this.scene.unload(this.scene)

            this.scene.load(Menu)
          })
      }
    }, 1500)
  }

  /**
   * Loads the main menu on slave screens.
   */
  private loadMenu() {
    this.socketService
      .emit('get-screens')
      .subscribe((data: LoadScreensData) => {
        if (!data) {
          return
        }

        this.lgSocketService.screens = data.screens
        this.lgSocketService.screenAmount = data.screenAmount

        destroyMultipleElements('ast-lg-screen-slave')
        this.scene.unload(this.scene)

        this.scene.load(Menu)
      })
  }
}
