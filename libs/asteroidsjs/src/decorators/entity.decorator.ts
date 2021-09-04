import { IEntityOptions } from '../interfaces/entity-options.interface'

import { ENTITY_OPTIONS } from '../constants'

/**
 * Decorator that marks a class as {@link Entity}
 *
 * An entity can be created with the `instantiate` method and they
 * represents objects that can handle components and services. An entity
 * must be marked with `@Entity` and extends `AbstractEntity` to work as
 * expected.
 *
 * Entities, such as components, are allowed to use methods like
 * `onAwake`, `onStart` and `onLoop`.
 *
 * @see {@link IOnAwake}
 * @see {@link IOnStart}
 * @see {@link IOnLoop}
 *
 * @param options defines and object that contains all the entity options
 * and dependencies
 */
export function Entity(options?: IEntityOptions): ClassDecorator {
  options ??= {}
  options.components ??= []
  options.services ??= []

  return (target) => {
    Reflect.defineMetadata(ENTITY_OPTIONS, options, target)
  }
}
