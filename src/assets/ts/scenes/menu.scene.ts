import { Scene, AbstractScene, IOnStart } from '@asteroidsjs'

import { Background } from '../entities/background.entity'
import { ManagerAsteroids } from '../entities/master/manager-asteroids.entity'
import { Menu as MenuEntity } from '../entities/menu.entity'

@Scene()
export class Menu extends AbstractScene implements IOnStart {
  onStart(): void {
    this.createCanvas({
      name: 'menu',
    })
    this.instantiate({ entity: Background })
    this.instantiate({ entity: MenuEntity })
    this.instantiate({ entity: ManagerAsteroids, use: { isMenu: true } })
  }
}
