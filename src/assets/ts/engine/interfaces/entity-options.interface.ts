import { AbstractComponent } from '../abstract-component'
import { AbstractProvider } from '../abstract-provider'
import { Type } from './type.interface'

export interface IEntityOptions {
  components?: Type<AbstractComponent>[]
  providers?: Type<AbstractProvider>[]
}
