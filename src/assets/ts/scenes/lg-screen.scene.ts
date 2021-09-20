import { Scene, AbstractScene, IOnStart } from '@asteroidsjs'

import { LGManager } from '../objects/lg/entities/lg-manager.entity'
import { Background } from '../ui/background/entities/background.entity'
import { LGScreenMenu } from '../ui/lg/entities/lg-screen-menu.entity'

@Scene()
export class LGScreen extends AbstractScene implements IOnStart {
  onStart(): void {
    this.createCanvas({
      name: 'lg-screen',
    })
    this.instantiate({ entity: Background })
    this.instantiate({ entity: LGManager })
    this.instantiate({ entity: LGScreenMenu })
  }
}
