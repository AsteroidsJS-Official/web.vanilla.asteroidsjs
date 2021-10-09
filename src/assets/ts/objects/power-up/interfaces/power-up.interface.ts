export type PowerUpType = 'health' | 'defense' | 'weapon' | 'time'

export type PowerUpName =
  | 'armor'
  | 'missile'
  | 'nuke'
  | 'rapid-fire'
  | 'repair'
  | 'shield'
  | 'shock-wave'
  | 'slow-motion'

export interface IPowerUp {
  /**
   * Property that defines whether the power up is passive.
   * In case it's true, the power up will activate as soon
   * as the player gets it.
   */
  isPassive: boolean

  /**
   * Property that defines whether the power up will be
   * destroyed after some time in case no player gets it.
   */
  hasLifeTime: boolean

  /**
   * Property that defines the amount of time in seconds
   * that the power up will take to be destroyed in case
   * 'hasLifeTime' is true.
   *
   * @example
   * lifeTime = 3 // the power up will be destroyed after 3 seconds
   */
  lifeTime: number

  /**
   * Property that defines the power up name.
   *
   * It must be some of the following:
   * ```txt
   * • armor
   * • health
   * • missile
   * • nuke
   * • rapid-fire
   * • shield
   * • shock-wave
   * • slow-motion
   * ```
   */
  name: PowerUpName

  /**
   * Property that defines the power up type.
   *
   * It must be some of the following:
   * ```txt
   * • health
   * • defense
   * • weapon
   * • time
   * ```
   */
  type: PowerUpType

  /**
   * Property that defines the power up active duration
   * in seconds, meaning that its effect will be stopped
   * some time.
   */
  duration: number

  /**
   * Property that defines a generic value that may be
   * used to set the value of some specific effect.
   *
   * In example:
   * ```txt
   * • heal or increase the max health from a player
   * • determine the amount of special shots that a player has
   * • determine the radius of a shield or shock wave
   * • increased the player fire rate
   * ```
   */
  affectValue: number

  /**
   * Property that defines the path to the audio file
   * that is played when a player acquires the power up.
   */
  acquireSound: string
}
