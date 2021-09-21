import { AbstractScene, IOnStart, Scene } from '@asteroidsjs'

import { ManagerAsteroids } from '../objects/asteroid/entities/manager-asteroids.entity'
import { Background } from '../ui/background/entities/background.entity'

@Scene()
export class ControllerMenu extends AbstractScene implements IOnStart {
  onStart(): void {
    this.createCanvas({
      name: 'controller-menu',
    })
    this.instantiate({ entity: Background })
    this.instantiate({ entity: ManagerAsteroids, use: { isMenu: true } })
  }
}
