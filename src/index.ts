import './global.scss'
import 'reflect-metadata'
import './assets/ts/menu.ts'

import { AsteroidsFactory } from '@asteroidsjs'

import { LGScreen } from './assets/ts/scenes/lg-screen.scene'

/**
 * Creates and starts the game.
 */
function bootstrap(): void {
  const game = AsteroidsFactory.create({
    bootstrap: [LGScreen],
  })
  game.start()
}
bootstrap()
