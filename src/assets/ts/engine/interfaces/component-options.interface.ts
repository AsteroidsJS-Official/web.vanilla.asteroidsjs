import { AbstractComponent } from '../abstract-component'
import { AbstractProvider } from '../abstract-provider'
import { Type } from './type.interface'

export interface IComponentOptions {
  providers?: Type<AbstractProvider>[]
  required?: Type<AbstractComponent>[]
}
