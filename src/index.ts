import './global.scss'
import 'reflect-metadata'
import './assets/ts/menu.ts'

import { AsteroidsFactory } from '@asteroidsjs'

import { Menu } from './assets/ts/scenes/menu.scene'

/**
 * Creates and starts the game.
 */
function bootstrap(): void {
  const game = AsteroidsFactory.create({
    bootstrap: [Menu],
  })
  game.start()
}
bootstrap()
