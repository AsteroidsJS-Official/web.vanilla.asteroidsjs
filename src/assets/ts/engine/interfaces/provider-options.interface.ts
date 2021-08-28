import { AbstractProvider } from '../abstract-provider'
import { Type } from './type.interface'

export interface IProviderOptions {
  providers?: Type<AbstractProvider>[]
}
