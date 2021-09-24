import { AbstractScene, IOnStart, Scene } from '@asteroidsjs'

import { Joystick as JoystickEntity } from '../ui/joystick/entities/joystick.entity'

@Scene()
export class Joystick extends AbstractScene implements IOnStart {
  onStart(): void {
    this.instantiate({ entity: JoystickEntity })
  }
}
