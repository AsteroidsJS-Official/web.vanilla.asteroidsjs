import { AbstractService } from '../abstract-service'

import { AbstractComponent } from '../abstract-component'
import { IComponentProperty } from './component-property.interface'

import { Type } from './type.interface'

export interface IEntityOptions {
  use?: any

  /**
   * Property that defines an array with all the component classes that
   * will be instantiated and passed as dependency to the new entity
   */
  components?: Type<AbstractComponent>[]

  /**
   * Property that defines an array with all the service classes that
   * will be instantiated and passed as dependency to the new entity
   */
  services?: Type<AbstractService>[]

  /**
   * Property that defines an array with all the properties that will be
   * passed to all the needed components
   */
  properties?: IComponentProperty[]
}
