import { AbstractProvider } from '../abstract-provider'

import { AbstractComponent } from '../abstract-component'

import { Type } from './type.interface'

export interface IComponentOptions {
  providers?: Type<AbstractProvider>[]
  required?: Type<AbstractComponent>[]
}
