import { AbstractService, IOnAwake, IScreen, Service } from '@asteroidsjs'

import { SocketService } from './socket.service'

import { GameService } from './game.service'

import { BehaviorSubject, Observable } from 'rxjs'

export type LoadScreensData = {
  screens: IScreen[]
  screenAmount: number
}

/**
 * Service responsible for socket liquid galaxy management.
 */
@Service({
  services: [GameService, SocketService],
})
export class LGSocketService extends AbstractService implements IOnAwake {
  private gameService: GameService

  private socketService: SocketService

  /**
   * Property that defines the amount of screens to be connected.
   *
   * @default 3
   */
  private readonly _screenAmount = new BehaviorSubject<number>(3)

  /**
   * Property that defines whether master screen is connected.
   */
  private readonly _isMasterConnected = new BehaviorSubject<boolean>(false)

  /**
   * Property that defines the current screen.
   */
  private readonly _screen = new BehaviorSubject<IScreen>(null)

  /**
   * Property that defines the amount of screens by side (around Master).
   *
   * @default 1
   */
  public screensBySide = 1

  /**
   * Property that defines all screens.
   */
  public screens: IScreen[] = []

  /**
   * Property that defines the canvas total width (all screens connected).
   */
  public canvasTotalWidth = 0

  /**
   * Property that defines the canvas total height (all screens connected).
   */
  public canvasTotalHeight = 0

  /**
   * Property that defines how much the canvas will displace to fit screen
   * position.
   */
  public displacement = 0

  public get screen$(): Observable<IScreen> {
    return this._screen.asObservable()
  }

  public get screen(): IScreen {
    return this._screen.value
  }

  public set screen(value: IScreen) {
    this._screen.next(value)
  }

  public get screenAmount$(): Observable<number> {
    return this._screenAmount.asObservable()
  }

  public get screenAmount(): number {
    return this._screenAmount.value
  }

  public set screenAmount(value: number) {
    this._screenAmount.next(value)
  }

  public get isMasterConnected$(): Observable<boolean> {
    return this._isMasterConnected.asObservable()
  }

  public get isMasterConnected(): boolean {
    return this._isMasterConnected.value
  }

  public set isMasterConnected(value: boolean) {
    this._isMasterConnected.next(value)
  }

  onAwake(): void {
    this.gameService = this.getService(GameService)
    this.socketService = this.getService(SocketService)
  }

  /**
   * Emits to all screens to change to a specific scene.
   *
   * @param scene The scene to be loaded.
   */
  changeScene(scene: string): void {
    this.socketService.emit('change-scene', scene)
  }

  startGame(): void {
    this.socketService.emit('start-game')
    this.gameService.isInGame = true
  }

  getGameStatus(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.socketService
        .emit<unknown, boolean>('get-game-status')
        .subscribe((isInGame) => {
          subscriber.next(isInGame)
        })
    })
  }

  /**
   * Loads and sets the existent screens.
   *
   * @returns An observable that returns the screens once they are loaded.
   */
  loadScreens(): Observable<IScreen[]> {
    return new Observable((subscriber) => {
      this.socketService
        .emit('get-screens', {})
        .subscribe((data: LoadScreensData) => {
          if (!data) {
            return
          }

          this.screens = data.screens
          this.screenAmount = data.screenAmount
          const master = this.getScreenByNumber(1)

          this.isMasterConnected = master && master.isConnected

          subscriber.next(this.screens)
        })
    })
  }

  /**
   * Connects a screens to the LG socket system.
   *
   * @param screenNumber The screen number to connect.
   * @returns An observable that returns the connected screen.style.
   */
  connectScreen(screenNumber?: number): Observable<IScreen> {
    return new Observable((subscriber) => {
      this.socketService
        .emit<{ number: number; width: number; height: number }, IScreen>(
          'connect-screen',
          {
            number: screenNumber,
            width: window.innerWidth,
            height: window.innerHeight,
          },
        )
        .subscribe((screen: IScreen) => {
          if (!screen) {
            return
          }

          console.log(screen)

          this.screen = screen
          this.addScreen(screen)

          if (screen.number === 1) {
            this.isMasterConnected = true
          }

          subscriber.next(screen)
        })
    })
  }

  /**
   * Computes the canvas total width and height and its displacement.
   */
  setCanvasSize(): void {
    if (!this.screen) {
      return
    }

    this.screen.position = this.getScreenLayout(this.screenAmount).findIndex(
      (s) => s === this.screen.number,
    )

    const screens = this.screens

    this.canvasTotalWidth = screens
      .map((s) => s.width)
      .reduce((previous, current) => previous + current, 0)

    this.canvasTotalHeight = this.getScreenByNumber(1)?.height || 0

    this.displacement = screens
      .filter((s) => s.position < this.screen.position)
      .map((s) => s.width)
      .reduce((previous, current) => previous + current, 0)
  }

  /**
   * Increases the screen amount by 2.
   */
  increaseScreenAmount(): void {
    this.screensBySide = Math.floor(this.screenAmount / 2)
    this.screenAmount = this.screenAmount + 2
  }

  /**
   * Decreases the screen amount by 2.
   */
  decreaseScreenAmount(): void {
    this.screensBySide = Math.floor(this.screenAmount / 2)
    this.screenAmount = this.screenAmount - 2
  }

  /**
   * Sets an specific amount to the screen amount.
   *
   * @param amount The screen amount to be set.
   */
  setScreenAmount(amount: number): void {
    this.screensBySide = Math.floor(this.screenAmount / 2)
    this.screenAmount = amount
  }

  /**
   * Gets a screen by it's number.
   *
   * @param number The number of the screen.
   * @returns The screen that matches the given number.
   */
  getScreenByNumber(number: number): IScreen {
    return this.screens.find((s) => s.number === number)
  }

  /**
   * Gets a screens layout according to the given amount.
   *
   * @param amount The screen amount.
   * @returns The screens layout.
   *
   * @example
   * ```ts
   * getScreenByNumber(5) => [4, 5, 1, 2, 3]
   * ```
   */
  getScreenLayout(amount: number): number[] {
    const layout = [...Array(amount).keys()].map((n) => n + 1)
    const amountBySide = Math.floor(amount / 2)

    return [
      ...layout.slice(amountBySide + 1),
      ...layout.slice(0, amountBySide + 1),
    ]
  }

  /**
   * Gets the local screen number.
   *
   * @returns The number that is present in the browser path.
   */
  getLocalScreenNumber(): number | null {
    let pathNumber = window.location.pathname.split('screen/')[1]

    if (pathNumber?.includes('/')) {
      pathNumber = pathNumber.split('/')[0]
    }

    return pathNumber ? +pathNumber : null
  }

  getScreensConnected(): number {
    return this.screens
      .filter((s) => s.isConnected)
      .reduce((previous) => previous + 1, 0)
  }

  /**
   * Adds a screens to the screens array.
   *
   * @param screen The screen to be added.
   */
  addScreen(screen: IScreen): void {
    const index = this.screens.findIndex((s) => screen.number === s.number)

    if (index !== -1) {
      this.screens[index] = screen
    } else {
      this.screens.push(screen)
    }
  }

  /**
   * Disconnects a screen in the screens array.
   *
   * @param screenNumber The screen to disconnect.
   */
  disconnectScreen(screenNumber: number): void {
    const index = this.screens.findIndex((s) => screenNumber === s.number)

    if (index !== -1) {
      this.screens[index] = {
        ...this.screens[index],
        isConnected: false,
      }
    }
  }

  /**
   * Emits to all screens that master is not waiting for connections anymore.
   */
  cancelConnection(): void {
    this.socketService.emit('cancel-connection')

    const master = this.getScreenByNumber(1)

    if (master) {
      this.screens = [master]
    }
  }
}
