import {
  AbstractEntity,
  addClass,
  appendChildren,
  createElement,
  destroyMultipleElements,
  Entity,
  getElement,
  getHtml,
  IOnAwake,
  IOnDestroy,
  IOnStart,
} from '@asteroidsjs'

import { MultiplayerService } from '../../../shared/services/multiplayer.service'
import { UserService } from '../../../shared/services/user.service'

import { IPlayer } from '../../../shared/interfaces/player.interface'

import { Subscription } from 'rxjs'

@Entity({
  services: [MultiplayerService, UserService],
})
export class ScoreMultiplayer
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private multiplayerService: MultiplayerService

  private userService: UserService

  private playerSubscription: Subscription

  onAwake(): void {
    this.multiplayerService = this.getService(MultiplayerService)
    this.userService = this.getService(UserService)
  }

  onStart(): void {
    this.insertScoreListHtml()
  }

  onDestroy(): void {
    destroyMultipleElements('ast-score-multiplayer')

    this.playerSubscription?.unsubscribe()
  }

  private async insertScoreListHtml(): Promise<void> {
    destroyMultipleElements('ast-score-multiplayer')

    const html = await getHtml('score-multiplayer', 'ast-score-multiplayer')

    appendChildren(document.body, html)

    this.playerSubscription = this.multiplayerService.players$.subscribe(
      (players) => {
        if (players) {
          this.updateScoreList(players)
        }
      },
    )
  }

  private updateScoreList(players: { [id: string]: IPlayer }): void {
    const scoreList = getElement('.score-list')

    if (!scoreList) {
      return
    }

    const rows: HTMLElement[] = []

    Object.values(players)
      .sort((p1, p2) => p1.score - p2.score)
      .slice(0, 5)
      .forEach((p) => {
        const scoreRow = getElement('.score-row.p-' + p.id)

        if (scoreRow) {
          const score = getElement(`.score-row.p-${p.id} .score`)
          score.innerHTML = p.score.toString()

          rows.push(scoreRow)
        } else {
          const row = createElement<HTMLDivElement>('div')
          addClass(row, 'score-row', 'p-' + p.id)

          if (p.id === this.userService.userId) {
            addClass(row, 'me')
          }

          const nickname = createElement('span')
          addClass(nickname, 'nickname')
          nickname.innerHTML = p.nickname

          const score = createElement('span')
          addClass(score, 'score')
          score.innerHTML = p.score.toString()

          appendChildren(row, nickname, score)

          rows.push(row)
        }
      })

    rows.sort((r1, r2) => {
      const rowScore1 = r1.getElementsByClassName('score')[0]?.innerHTML
      const rowScore2 = r2.getElementsByClassName('score')[0]?.innerHTML

      if (!(rowScore1 && rowScore2)) {
        return 0
      }

      return +rowScore1 - +rowScore2 <= 0 ? 1 : -1
    })

    scoreList.innerHTML = ''
    appendChildren(scoreList, ...rows)
  }
}
