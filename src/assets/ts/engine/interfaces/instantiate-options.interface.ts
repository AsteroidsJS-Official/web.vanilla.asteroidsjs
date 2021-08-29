import { AbstractEntity } from '../abstract-entity'
import { IEntityOptions } from './entity-options.interface'
import { Type } from './type.interface'

/**
 * Interface that represents all the needed data to instantiate some
 * entity
 */
export interface IInstantiateOptions<E extends AbstractEntity>
  extends IEntityOptions {
  /**
   * Property that defines an entity type that will be instantiated
   */
  entity?: Type<E>

  use?: Partial<E>
}
