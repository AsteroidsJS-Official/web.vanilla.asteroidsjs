import { Scene, AbstractScene, IOnStart } from '@asteroidsjs'

import { Manager } from '../objects/manager/entities/manager.entity'
import { Background } from '../ui/background/entities/background.entity'
import { SpaceBackground } from '../ui/background/entities/space-background.entity'

@Scene()
export class Single extends AbstractScene implements IOnStart {
  onStart(): void {
    this.createCanvas({
      name: 'single',
      mode: 'clear',
      sortingLayer: '1',
    })
    this.createCanvas({
      name: 'trailing',
    })

    this.instantiate({ entity: Background })
    this.instantiate({ entity: SpaceBackground })

    this.instantiate({ entity: Manager })
  }
}
