import { IServiceOptions } from '../interfaces/provider-options.interface'

import { SERVICE_OPTIONS } from '../constants'

export function Service(options?: IServiceOptions): ClassDecorator {
  options ??= {}
  options.services ??= []

  return (target) => {
    Reflect.defineMetadata(SERVICE_OPTIONS, options, target)
  }
}
