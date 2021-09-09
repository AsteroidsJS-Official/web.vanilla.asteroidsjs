import { AbstractService, Service } from '@asteroidsjs'

import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Service responsible for the management of the user.
 */
@Service()
export class UserService extends AbstractService {
  private readonly score = new BehaviorSubject<number>(0)

  public nickname = 'GUEST'

  public spaceshipColor = '#888888'

  public spaceshipImage = 'grey'

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
}
