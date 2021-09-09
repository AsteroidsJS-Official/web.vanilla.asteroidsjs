/**
 * Interface that represents some class that has a `onStart` method, that is
 * called after all the awake method be called
 */
export interface IOnStart {
  /**
   * Method that will be called after the awake method be called
   */
  onStart(): void | Promise<void>
}
