import { ICollision2 } from './collision2.interface'

export interface IOnTriggerEnter {
  onTriggerEnter(collistion: ICollision2): void
}
