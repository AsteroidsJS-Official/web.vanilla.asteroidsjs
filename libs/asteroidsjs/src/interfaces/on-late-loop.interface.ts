/**
 * Interface that represents some class that has a `onLateLoop` method that is
 * called after the `onLoop` method
 */
export interface IOnLateLoop {
  /**
   * Method that will be called every game cycle
   */
  onLateLoop(): void
}
