import { AbstractEntity, Entity, getHtml, IOnAwake } from '@asteroidsjs'

@Entity()
export class Score extends AbstractEntity implements IOnAwake {
  onAwake(): void {
    getHtml('score', 'ast-score').then((html) => {
      document.body.appendChild(html)
    })
  }
}
