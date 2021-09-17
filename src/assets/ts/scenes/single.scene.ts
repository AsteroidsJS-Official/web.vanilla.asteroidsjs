import { Scene, AbstractScene, IOnStart } from '@asteroidsjs'

import { Background } from '../entities/background.entity'
import { Manager } from '../entities/manager.entity'

@Scene()
export class Single extends AbstractScene implements IOnStart {
  onStart(): void {
    this.createCanvas({
      name: 'single',
    })
    this.instantiate({ entity: Background })
    this.instantiate({ entity: Manager })
  }
}
