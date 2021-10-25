/**
 * Interface that represents some class that has a `onLoop` method that is
 * called every game cycle
 */
export interface IOnLoop {
  /**
   * Method that will be called every game cycle
   */
  onLoop(): void
}
