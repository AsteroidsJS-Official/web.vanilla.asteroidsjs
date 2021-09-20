import { Scene, AbstractScene, IOnStart } from '@asteroidsjs'

import { Manager } from '../objects/manager/entities/manager.entity'
import { Background } from '../ui/background/entities/background.entity'

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
