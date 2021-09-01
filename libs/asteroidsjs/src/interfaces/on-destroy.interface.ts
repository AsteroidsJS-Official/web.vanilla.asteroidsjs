/**
 * Interface that represents some class that has a `onDestroy` method, that is
 * called when the entity is destroyed
 */
export interface IOnDestroy {
  /**
   * Method that will be called when the entity is destroyed
   */
  onDestroy(): void
}
