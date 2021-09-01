/**
 * Interface that represents some class that has a `onDraw` method, that
 * should be used to render the entity image
 */
export interface IDraw {
  /**
   * Method responsible to render the entity image
   */
  draw(): void
}
