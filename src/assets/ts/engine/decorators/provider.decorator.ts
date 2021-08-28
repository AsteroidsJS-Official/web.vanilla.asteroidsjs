import { PROVIDER_OPTIONS } from '../constants'
import { IProviderOptions } from '../interfaces/provider-options.interface'

export function Provider(options?: IProviderOptions): ClassDecorator {
  options ??= {}
  options.providers ??= []

  return (target) => {
    Reflect.defineMetadata(PROVIDER_OPTIONS, options, target)
  }
}
