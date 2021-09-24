import { AbstractService, Service } from '@asteroidsjs'

import { IPlayer } from '../interfaces/player.interface'

import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Service responsible for the management of the user.
 */
@Service()
export class UserService extends AbstractService {
  /**
   * Property that indicates the user score.
   */
  private readonly _score = new BehaviorSubject<number>(0)

  /**
   * Property that defines the user id.
   */
  public userId = 'fbA8293AA89'

  /**
   * Property that defines the user nickname.
   */
  public nickname = 'GUEST'

  /**
   * Property that defines the user spaceship color.
   */
  public spaceshipColor = '#888888'

  /**
   * Property that defines the user spaceship image.
   */
  public spaceshipImage = 'grey'

  /**
   * Property responsible for the user score observer.
   *
   * @return The score observable.
   */
  public get score$(): Observable<number> {
    return this._score.asObservable()
  }

  /**
   * Property responsible for returning the score value.
   */
  public get score(): number {
    return this._score.value
  }

  /**
   * Property responsible for returning the player data.
   */
  public get player(): IPlayer {
    return {
      id: this.userId,
      color: this.spaceshipImage,
      nickname: this.nickname,
      score: this.score,
    }
  }

  /**
   * Adds an amount of points to the current score.
   *
   * @param amount The amount of points to add to the score.
   */
  public increaseScore(amount: number): void {
    this._score.next(this._score.value + amount)
  }

  /**
   * Sets the user score according to the given points.
   *
   * @param amount The amount of points to set to the score.
   */
  public setScore(amount: number): void {
    this._score.next(amount)
  }

  /**
   * Resets the user score.
   */
  public resetScore(): void {
    this._score.next(0)
  }
}
