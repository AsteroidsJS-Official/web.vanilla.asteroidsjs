import { AbstractScene, IOnStart, Scene } from '@asteroidsjs'

import { ManagerLocal } from '../objects/manager-local/entities/manager-local.entity'
import { Background } from '../ui/background/entities/background.entity'
import { SpaceBackground } from '../ui/background/entities/space-background.entity'

@Scene()
export class LocalMP extends AbstractScene implements IOnStart {
  onStart(): void {
    this.createCanvas({
      name: 'local-mp',
      mode: 'clear',
      sortingLayer: '1',
    })
    this.createCanvas({
      name: 'trailing',
    })
    this.instantiate({ entity: Background })
    this.instantiate({ entity: SpaceBackground })

    this.instantiate({ entity: ManagerLocal })
  }
}
