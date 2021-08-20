import { Entity } from '../core/entity'
import { Type } from './type.interface'

export interface GameFactoryOptions {
  bootstrap: Type<Entity>[]
}
