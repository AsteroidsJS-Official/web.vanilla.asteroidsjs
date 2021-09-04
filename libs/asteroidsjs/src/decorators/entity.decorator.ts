import { IEntityOptions } from '../interfaces/entity-options.interface'

import { ENTITY_OPTIONS } from '../constants'

export function Entity(options?: IEntityOptions): ClassDecorator {
  options ??= {}
  options.components ??= []
  options.services ??= []
  options.properties ??= []

  return (target) => {
    Reflect.defineMetadata(ENTITY_OPTIONS, options, target)
  }
}
