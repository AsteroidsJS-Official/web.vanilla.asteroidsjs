import { AbstractProvider } from '../abstract-provider'
import { PROVIDER_OPTIONS } from '../constants'
import { Type } from '../interfaces/type.interface'

interface IProviderOptions {
  providers?: Type<AbstractProvider>[]
}

export function Provider(options?: IProviderOptions): ClassDecorator {
  options ??= {}
  options.providers ??= []

  return (target) => {
    Reflect.defineMetadata(PROVIDER_OPTIONS, options, target)
  }
}
