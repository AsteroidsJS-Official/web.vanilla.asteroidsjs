import { Entity } from '../engine/core/entity'
import { IStart } from '../engine/interfaces/start.interface'

export class Manager extends Entity implements IStart {
  public start(): void {
    console.log('game started')
  }
}
