import { IServiceOptions } from '../interfaces/provider-options.interface'

import { SERVICE_OPTIONS } from '../constants'

/**
 * Decorator that marks a class as {@link Service}
 *
 * A service can be passed as dependecy to entities and components. It
 * defines some object that handles any business logic, such as an `api
 * implementation` or a `plugin`. A service must be marked with `@Service`
 * and extends `AbstractService` to work as expected.
 *
 * Services are allowed to use only the `onAwake` method
 *
 * @see {@link IOnAwake}
 *
 * @param options defines and object that contains all the entity options
 * and dependencies
 */
export function Service(options?: IServiceOptions): ClassDecorator {
  options ??= {}
  options.services ??= []

  return (target) => {
    Reflect.defineMetadata(SERVICE_OPTIONS, options, target)
  }
}
