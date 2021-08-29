import { AbstractComponent } from '../abstract-component'
import { AbstractProvider } from '../abstract-provider'
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
   * Property that defines an array with all the provider classes that
   * will be instantiated and passed as dependency to the new entity
   */
  providers?: Type<AbstractProvider>[]

  /**
   * Property that defines an array with all the properties that will be
   * passed to all the needed components
   */
  properties?: IComponentProperty[]
}
