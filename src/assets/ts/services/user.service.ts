import { AbstractService, Service } from '@asteroidsjs'

import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Service responsible for the management of the user.
 */
@Service()
export class UserService extends AbstractService {
  /**
   * Property that indicates the user score.
   */
  private readonly score = new BehaviorSubject<number>(0)

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
    return this.score.asObservable()
  }

  /**
   * Adds an amount of points to the current score.
   *
   * @param amount The amount of points to add to the score.
   */
  public increaseScore(amount: number): void {
    this.score.next(this.score.value + amount)
  }

  /**
   * Sets the user score according to the given points.
   *
   * @param amount The amount of points to set to the score.
   */
  public setScore(amount: number): void {
    this.score.next(amount)
  }

  /**
   * Resets the user score.
   */
  public resetScore(): void {
    this.score.next(0)
  }
}
