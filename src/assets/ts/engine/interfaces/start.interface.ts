/**
 * Interface that represents some class that has a `start` method, that is
 * called after all the entity dependencies be resolved
 */
export interface IStart {
  /**
   * Method that will be called after all the entity dependencies be resolved
   */
  start(): void
}
