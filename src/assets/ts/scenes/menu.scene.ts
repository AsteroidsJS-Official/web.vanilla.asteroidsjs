import { Scene, AbstractScene, IOnStart } from '@asteroidsjs'

import { ManagerAsteroids } from '../objects/asteroid/entities/manager-asteroids.entity'
import { Background } from '../ui/background/entities/background.entity'
import { Menu as MenuEntity } from '../ui/menu/entities/menu.entity'

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
