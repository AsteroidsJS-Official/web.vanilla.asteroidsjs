import './global.scss'
import 'reflect-metadata'
import './assets/ts/menu.ts'

import { AbstractScene, AsteroidsFactory, Type } from '@asteroidsjs'

import { isMobile } from './assets/ts/utils/platform'

import { ControllerMenu } from './assets/ts/scenes/controller-menu.scene'
import { LGScreen } from './assets/ts/scenes/lg-screen.scene'

/**
 * Creates and starts the game.
 */
function bootstrap<S extends AbstractScene>(scene: Type<S>): void {
  const game = AsteroidsFactory.create({
    bootstrap: [scene],
  })
  game.start()
}
bootstrap(isMobile ? ControllerMenu : LGScreen)
