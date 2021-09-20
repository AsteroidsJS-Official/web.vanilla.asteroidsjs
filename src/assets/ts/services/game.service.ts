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
   * Property responsible for keeping the current asteroids amount
   * on the game.
   */
  private _asteroidsAmount = new BehaviorSubject<number>(0)

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
