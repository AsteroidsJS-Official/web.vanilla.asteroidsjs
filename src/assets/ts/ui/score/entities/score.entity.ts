import {
  AbstractEntity,
  Entity,
  getHtml,
  IOnAwake,
  IOnDestroy,
} from '@asteroidsjs'

import { UserService } from '../../../shared/services/user.service'

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
        this.userService.setScore(this.score)
      }

      document.body.appendChild(html)
    })
  }

  onDestroy(): void {
    const scoreEl = document.querySelector('ast-score')

    if (scoreEl) {
      scoreEl.remove()
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
