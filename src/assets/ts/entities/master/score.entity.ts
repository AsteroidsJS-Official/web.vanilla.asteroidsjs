import {
  AbstractEntity,
  Entity,
  getHtml,
  IOnAwake,
  IOnDestroy,
} from '@asteroidsjs'

import { UserService } from '../../services/user.service'

@Entity({
  services: [UserService],
})
export class Score extends AbstractEntity implements IOnAwake, IOnDestroy {
  private userService: UserService

  public score = 0

  onAwake(): void {
    this.userService = this.getService(UserService)

    this.userService.score$.subscribe((score) => {
      this.increaseScore(score)
    })

    getHtml('score', 'ast-score').then((html) => {
      const scoreEl = html.getElementsByClassName('score')[0]
      if (scoreEl) {
        this.score = +scoreEl.innerHTML
      }

      document.body.appendChild(html)
    })
  }

  onDestroy(): void {
    const scoreEl = document.querySelector('.score-container > .score')

    if (scoreEl) {
      document.body.removeChild(scoreEl)
    }
  }

  public increaseScore(amount: number): number {
    this.score = amount
    const scoreEl = document.querySelector('.score-container > .score')

    if (scoreEl) {
      scoreEl.innerHTML = this.score.toString()
    }

    return amount
  }
}
