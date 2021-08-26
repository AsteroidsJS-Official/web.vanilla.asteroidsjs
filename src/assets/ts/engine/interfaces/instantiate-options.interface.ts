import { Component } from '../core/component'
import { Entity } from '../core/entity'
import { Type } from './type.interface'

/**
 * Interface that represents all the needed data to instantiate some
 * entity
 */
export interface IInstantiateOptions<E extends Entity> {
  /**
   * Property that defines an entity type that will be instantiated
   */
  entity?: Type<E>

  /**
   * Property that defines an array with all the component classes that
   * will be instantiated and passed as dependency to the new entity
   */
  components?: Type<Component>[]
}
