import { AbstractEntity } from '../abstract-entity'
import { IEntityOptions } from './entity-options.interface'

import { Type } from './type.interface'

import { AbstractScene } from '../abstract-scene'

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

  /**
   * Property that defines properties that will be used to set values to
   * this entity
   */
  use?: Partial<E>

  /**
   * Property that defines the reference to the scene where the entity
   * is instantiated
   */
  scene?: AbstractScene
}
