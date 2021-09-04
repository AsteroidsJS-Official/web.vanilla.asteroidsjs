import { IComponentOptions } from '../interfaces/component-options.interface'

import { COMPONENT_OPTIONS } from '../constants'

export function Component(options?: IComponentOptions): ClassDecorator {
  options ??= {}
  options.services ??= []
  options.required ?? []

  return (target) => {
    Reflect.defineMetadata(COMPONENT_OPTIONS, options, target)
  }
}
