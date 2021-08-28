import { AbstractComponent } from '../abstract-component'
import { AbstractProvider } from '../abstract-provider'
import { ENTITY_OPTIONS } from '../constants'
import { Type } from '../interfaces/type.interface'

interface IEntityOptions {
  components?: Type<AbstractComponent>[]
  providers?: Type<AbstractProvider>[]
}

export function Entity(options?: IEntityOptions): ClassDecorator {
  options ??= {}
  options.components ??= []
  options.providers ??= []

  return (target) => {
    Reflect.defineMetadata(ENTITY_OPTIONS, options, target)
  }
}
