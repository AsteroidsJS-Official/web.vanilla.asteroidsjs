import { AbstractProvider } from '../abstract-provider'
import { COMPONENT_OPTIONS } from '../constants'
import { Type } from '../interfaces/type.interface'

interface IComponentOptions {
  providers?: Type<AbstractProvider>[]
}

export function Component(options?: IComponentOptions): ClassDecorator {
  options ??= {}
  options.providers ??= []

  return (target) => {
    Reflect.defineMetadata(COMPONENT_OPTIONS, options, target)
  }
}
