/**
 * Interface that represents some class that has a `awake` method, that is
 * called after all the entity dependencies be resolved
 */
export interface IOnAwake {
  /**
   * Method that will be called after all the entity dependencies be resolved
   */
  onAwake(): void
}
