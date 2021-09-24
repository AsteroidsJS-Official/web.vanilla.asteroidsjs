/**
 * Interface that represents the player data.
 */
export interface IPlayer {
  /**
   * Property that represents the player id.
   */
  id: string

  /**
   * Property that represents the player nickname.
   */
  nickname: string

  /**
   * Property that represents the player color.
   */
  color: string

  /**
   * Property that represents the player score in the current
   * match.
   */
  score: number
}

/**
 * Interface that represents the player visual data.
 */
export interface IPlayerVisual {
  /**
   * Property that represents the player nickname.
   */
  nickname: string

  /**
   * Property that represents the player color.
   */
  color: string
}
