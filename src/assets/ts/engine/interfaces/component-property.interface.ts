import { AbstractComponent } from '../abstract-component'
import { Type } from './type.interface'

export interface IComponentProperty {
  for: Type<AbstractComponent>
  use: Record<string, unknown>
}
