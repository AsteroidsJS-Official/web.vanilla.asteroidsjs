import './global.scss'
import 'reflect-metadata'

import { AbstractScene, AsteroidsFactory, Type } from '@asteroidsjs'

import { isMobile } from './assets/ts/utils/platform'

import { LGScreen } from './assets/ts/scenes/lg-screen.scene'
import { Menu } from './assets/ts/scenes/menu.scene'

/**
 * Creates and starts the game.
 */
function bootstrap<S extends AbstractScene>(scene: Type<S>): void {
  const game = AsteroidsFactory.create({
    bootstrap: [scene],
  })
  game.start()
}
bootstrap(isMobile ? Menu : LGScreen)
