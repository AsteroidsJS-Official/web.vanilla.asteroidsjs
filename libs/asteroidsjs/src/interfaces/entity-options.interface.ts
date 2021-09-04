import { AbstractService } from '../abstract-service'

import { AbstractComponent } from '../abstract-component'

import { IProvider } from './provider.interface'
import { Type } from './type.interface'

/**
 * Interface that represents all the options that can be passed to an
 * entity when creating it
 */
export interface IEntityOptions {
  /**
   * Property that defines properties that will be used to set values to
   * this entity
   */
  use?: any

  /**
   * Property that defines an array with all the component classes that
   * will be instantiated and passed as dependency to the new entity
   */
  components?: (Type<AbstractComponent> | IProvider<AbstractComponent>)[]

  /**
   * Property that defines an array with all the service classes that
   * will be instantiated and passed as dependency to the new entity
   */
  services?: (Type<AbstractService> | IProvider<AbstractService>)[]
}
