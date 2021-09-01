/**
 * Interface that represents some class that has a `onFixedLoop` method that
 * is called every game physics cycle
 */
export interface IOnFixedLoop {
  /**
   * Method that will be called every game physics cycle
   */
  onFixedLoop(): void
}
