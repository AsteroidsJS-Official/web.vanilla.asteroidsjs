import { IScreen } from '../../interfaces/screen.interface'
import { AbstractEntity } from '../abstract-entity'
import { Type } from './type.interface'

/**
 * Interface that represents all the options the user can set for running
 * the game instance
 */
export interface GameFactoryOptions {
  screen: IScreen

  /**
   * Property that defines the canvas displacement
   *
   * @note This property is only  applied when the `Multiple Screens` is
   * applied
   */
  displacement?: number

  /**
   * Property that represents an array of entities that will be the first
   * ones to be instanciated in the application
   */
  bootstrap: Type<AbstractEntity>[]
}
