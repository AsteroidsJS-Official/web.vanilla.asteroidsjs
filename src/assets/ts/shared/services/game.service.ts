import { AbstractService, Service } from '@asteroidsjs'

import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Service responsible for the management of the game.
 */
@Service()
export class GameService extends AbstractService {
  /**
   * Property responsible for keeping whether the player died.
   */
  private _gameOver = new BehaviorSubject<boolean>(false)

  /**
   * Property responsible for keeping the current asteroid amount
   * on the game.
   */
  private _asteroidsAmount = new BehaviorSubject<number>(0)

  /**
   * Property that defines the maximum asteroid amount in game,
   * limiting the generation of new non fragment asteroid.
   *
   * @default 10
   */
  public maxAsteroidsAmount = 10

  /**
   * Property that defines whether the master has already confirmed
   * the screens connection/amount.
   */
  public isInGame = false

  /**
   * Property that defines whether the master is in a local multiplayer
   * game.
   */
  public isInLocalMPGame = false

  /**
   * Property that defines whether the user is connected to any
   * multiplayer game.
   */
  public isConnectedToRoom = false

  public get gameOver$(): Observable<boolean> {
    return this._gameOver.asObservable()
  }

  public get gameOver(): boolean {
    return this._gameOver.value
  }

  public set gameOver(value: boolean) {
    this._gameOver.next(value)
  }

  public get asteroidsAmount$(): Observable<number> {
    return this._asteroidsAmount.asObservable()
  }

  public get asteroidsAmount(): number {
    return this._asteroidsAmount.value
  }

  public set asteroidsAmount(value: number) {
    this._asteroidsAmount.next(value)
  }
}
