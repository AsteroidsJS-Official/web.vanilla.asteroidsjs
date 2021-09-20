import { ICollision2 } from './collision2.interface'

export interface IOnTriggerStay {
  onTriggerStay(collistion: ICollision2): void
}
