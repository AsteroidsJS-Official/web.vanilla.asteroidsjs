import './global.scss'

import { GameFactory } from './assets/ts/engine/game.factory'
import { Manager } from './assets/ts/entities/manager.entity'

function bootstrap(): void {
  const game = GameFactory.create({ bootstrap: [Manager] })
  game.start()
}
bootstrap()
