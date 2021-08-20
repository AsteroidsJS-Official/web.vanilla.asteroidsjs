/**
 * Interface that represents some class that has a `loop` method that is
 * called evenry game cycle
 */
export interface ILoop {
  /**
   * Method that will be called every game cycle
   */
  loop(): void
}
