/**
 * Interface responsible for keeping the joystick actions status.
 */
export interface IJoystickActions {
  /**
   * Property responsible for keeping the joystick shooting status.
   */
  isShooting: boolean

  /**
   * Property responsible for keeping the joystick boosting status.
   */
  isBoosting: boolean

  /**
   * Property responsible for keeping whether the joystick skill
   * were activated.
   */
  activatedSkill: boolean

  /**
   * Property responsible for keeping the joystick rotation direction.
   */
  rotating: 'left' | 'right' | null
}
