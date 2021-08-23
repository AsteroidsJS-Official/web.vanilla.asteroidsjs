import io from 'socket.io-client/dist/socket.io.js'

import './global.scss'
import { GameFactory } from './assets/ts/engine/game.factory'
import { Manager } from './assets/ts/entities/manager.entity'
import { IScreen } from './assets/ts/interfaces/screen.interface'

const socket = io('http://localhost:8080')

socket.emit(
  'connectScreen',
  window.location.pathname.split('/screen/')[1].split('/')[0],
  window.innerWidth,
  window.innerHeight,
  (response: IScreen) => {
    console.log(response)
    bootstrap()
  },
)

// TODO: pass window sizes as params to setup()
function bootstrap(): void {
  const game = GameFactory.create({ bootstrap: [Manager] })
  game.start()
}
