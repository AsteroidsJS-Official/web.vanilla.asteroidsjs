import './global.scss'
import 'reflect-metadata'
import './assets/ts/menu.ts'

import { AsteroidsFactory } from '@asteroidsjs'

import { Single } from './assets/ts/scenes/single.scene'

/**
 * Creates and starts the game.
 */
function bootstrap(): void {
  const game = AsteroidsFactory.create({
    bootstrap: [Single],
  })
  game.start()
}
bootstrap()
