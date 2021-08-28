import { AbstractComponent } from '../abstract-component'
import { AbstractEntity } from '../abstract-entity'
import { AbstractProvider } from '../abstract-provider'
import { Type } from './type.interface'

/**
 * Interface that represents all the needed data to instantiate some
 * entity
 */
export interface IInstantiateOptions<E extends AbstractEntity> {
  /**
   * Property that defines an entity type that will be instantiated
   */
  entity?: Type<E>

  /**
   * Property that defines an array with all the component classes that
   * will be instantiated and passed as dependency to the new entity
   */
  components?: Type<AbstractComponent>[]

  /**
   * Property that defines an array with all the provider classes that
   * will be instantiated and passed as dependency to the new entity
   */
  providers?: Type<AbstractProvider>[]
}
