import { AbstractService, Service } from '@asteroidsjs'

import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Service responsible for the management of the game.
 */
@Service()
export class GameService extends AbstractService {
  private _gameOver = new BehaviorSubject<boolean>(false)

  public get gameOver$(): Observable<boolean> {
    return this._gameOver.asObservable()
  }

  public get gameOver(): boolean {
    return this._gameOver.value
  }

  public set gameOver(value: boolean) {
    this._gameOver.next(value)
  }
}
