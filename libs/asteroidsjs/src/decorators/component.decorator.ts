import { IComponentOptions } from '../interfaces/component-options.interface'

import { COMPONENT_OPTIONS } from '../constants'

/**
 * Decorator that marks a class as {@link Component}.
 *
 * A component can be passed as dependecy to entities and defines new
 * behaviours to them. A component must be marked with `@Component` and
 * extends `AbstractComponent` to work as expected.
 *
 * Components, such as entities, are allowed to use methods like
 * `onAwake`, `onStart` and `onLoop`.
 *
 * @see {@link IOnAwake}
 * @see {@link IOnStart}
 * @see {@link IOnLoop}
 *
 * @param options defines an object that contains all the component
 * options and dependencies
 */
export function Component(options?: IComponentOptions): ClassDecorator {
  options ??= {}
  options.services ??= []
  options.required ?? []

  return (target) => {
    Reflect.defineMetadata(COMPONENT_OPTIONS, options, target)
  }
}
