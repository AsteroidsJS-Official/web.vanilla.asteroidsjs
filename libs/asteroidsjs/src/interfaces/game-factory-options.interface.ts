import { Type } from './type.interface'

import { AbstractScene } from '../abstract-scene'

/**
 * Interface that represents all the options the user can set for running
 * the game instance
 */
export interface GameFactoryOptions {
  /**
   * Property that represents an array of entities that will be the first
   * ones to be instanciated in the application
   */
  bootstrap: Type<AbstractScene>[]
}
