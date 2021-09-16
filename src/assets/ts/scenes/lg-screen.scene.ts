import { Scene, AbstractScene, IOnStart } from '@asteroidsjs'

import { Background } from '../entities/background.entity'
import { LGManager } from '../entities/lg-manager.entity'
import { LGScreenMenu } from '../entities/lg-screen-menu.entity'

@Scene()
export class LGScreen extends AbstractScene implements IOnStart {
  onStart(): void {
    this.createCanvas()
    this.instantiate({ entity: Background })
    this.instantiate({ entity: LGManager })
    this.instantiate({ entity: LGScreenMenu })
  }
}
