import { Entity } from '../core/entity'
import { Type } from './type.interface'

export interface GameFactoryOptions {
  bootstrap: Type<Entity>[]
  screenNumber: number
  width?: number
  height?: number
}
