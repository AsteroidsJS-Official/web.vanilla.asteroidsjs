import { AbstractService } from '../abstract-service'

import { AbstractComponent } from '../abstract-component'

import { Type } from '.'

/**
 * Interface that represents a provider object
 *
 * Objects of type Provider can be passed as dependecy for components and
 * services in order to instantiate them using properties or defining some
 * identifier, when using several of them.
 *
 * @example
 * this.instantiate({
 *  entity: MyEntity,
 *  components: [
 *    {
 *      class: MyComponent01,
 *      use: {
 *        property01: 20,
 *      },
 *    },
 *    {
 *      id: "__my_entity_my_component_2__"
 *      use: {
 *        property01: 20,
 *      },
 *    },
 *  ],
 *})
 */
export type IProvider<T = AbstractComponent | AbstractService> =
  | IClassProvider<T>
  | IIdentifiedProvider<T>

interface IClassProvider<T = AbstractComponent | AbstractService> {
  id?: string | number
  class: Type<T>
  use?: Record<string, any>
}

interface IIdentifiedProvider<T = AbstractComponent | AbstractService> {
  id: string | number
  class?: Type<T>
  use?: Record<string, any>
}
