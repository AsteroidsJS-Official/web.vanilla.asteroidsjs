/**
 * Interface that represents the data of a screen (master and slave).
 */
export interface IScreen {
  /**
   * Property that contains the screen socket id.
   */
  id: string

  /**
   * Property that represents the screen number.
   */
  number: number

  /**
   * Property that represents the screen width.
   */
  width: number

  /**
   * Property that represents the screen height.
   */
  height: number

  /**
   * Property that represents the screen position/index in the screens array.
   *
   * @example
   * // screen number 2 with a total of 5 screens
   * // [4, 5, 1, 2, 3] - index 3
   * 3
   */
  position: number
}
