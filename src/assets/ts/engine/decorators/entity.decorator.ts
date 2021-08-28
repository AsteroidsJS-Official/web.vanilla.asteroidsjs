import { ENTITY_OPTIONS } from '../constants'
import { IEntityOptions } from '../interfaces/entity-options.interface'

export function Entity(options?: IEntityOptions): ClassDecorator {
  options ??= {}
  options.components ??= []
  options.providers ??= []

  return (target) => {
    Reflect.defineMetadata(ENTITY_OPTIONS, options, target)
  }
}
