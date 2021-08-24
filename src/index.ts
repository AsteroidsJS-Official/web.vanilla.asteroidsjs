import './global.scss'
import { socket } from './assets/ts/socket'

import { GameFactory } from './assets/ts/engine/game.factory'
import { Manager } from './assets/ts/entities/manager.entity'
import { IScreen } from './assets/ts/interfaces/screen.interface'

const connectScreenData = {
  number: window.location.pathname.split('/screen/')[1].split('/')[0],
  width: window.innerWidth,
  height: window.innerHeight,
}

function connectScreen(response: IScreen): void {
  console.log(response)
  bootstrap(response)
}
socket.emit('connect-screen', connectScreenData, connectScreen)

function bootstrap(response: IScreen): void {
  const game = GameFactory.create({
    bootstrap: [Manager],
    screenNumber: response.number,
    width: response.width,
    height: response.height,
  })
  game.start()
}
