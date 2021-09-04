/**
 * Interface that represents some class that has a `onAwake` method, that is
 * called after all the entity dependencies be resolved
 */
export interface IOnAwake {
  /**
   * Method that will be called after all the entity dependencies be resolved
   */
  onAwake(): void
}
