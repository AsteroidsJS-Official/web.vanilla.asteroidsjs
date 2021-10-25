import {
  AbstractEntity,
  appendChildren,
  destroyMultipleElements,
  Entity,
  getElement,
  getHtml,
  IOnAwake,
  IOnDestroy,
  IOnStart,
} from '@asteroidsjs'

import { UserService } from '../../../shared/services/user.service'

@Entity({
  services: [UserService],
})
export class Score
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private userService: UserService

  public score = 0

  onAwake(): void {
    this.userService = this.getService(UserService)
  }

  onStart(): void {
    this.userService.score$.subscribe((score) => {
      this.increaseScore(score)
    })

    this.insertScoreHtml()
  }

  onDestroy(): void {
    destroyMultipleElements('ast-score')
  }

  /**
   * Inserts the score HTML into the body.
   */
  private async insertScoreHtml(): Promise<void> {
    destroyMultipleElements('ast-score')

    const html = await getHtml('score', 'ast-score')
    const score = html.getElementsByClassName('score')[0]

    if (score) {
      this.score = +score.innerHTML
      this.userService.setScore(this.score)
    }

    appendChildren(document.body, html)
  }

  /**
   * Increases the score according to the given amount.
   *
   * @param amount The amount of points to be added.
   * @returns The new points amount.
   */
  public increaseScore(amount: number): number {
    this.score = amount
    const scoreEl = getElement('.score-container > .score')

    if (scoreEl) {
      scoreEl.innerHTML = this.score.toString()
    }

    return amount
  }
}
