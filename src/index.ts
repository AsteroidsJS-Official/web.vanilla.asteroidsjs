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

  let canvasWidth = 0
  let canvasHeight = 0
  let displacement = 0

  const button = document.getElementById('play-button')

  if (!button) {
    return
  }

  button.style.display = !response || response.number !== 1 ? 'none' : 'block'

  button.addEventListener('click', () => {
    socket.emit('start-game')
  })

  socket.on('start-game', () => {
    button.style.display = 'none'

    socket.emit(
      'get-screens',
      (data: {
        screens: { [key: string]: IScreen }
        canvasWidth: number
        canvasHeight: number
      }) => {
        canvasWidth = data.canvasWidth
        canvasHeight = data.canvasHeight

        displacement = Object.values(data.screens)
          .filter((s) => s.position < data.screens[response.number].position)
          .map((s) => s.width)
          .reduce((previous, current) => previous + current, 0)

        bootstrap(
          { ...response, width: canvasWidth, height: canvasHeight },
          displacement,
        )
      },
    )
  })
}
socket.emit('connect-screen', connectScreenData, connectScreen)

function bootstrap(response: IScreen, displacement: number): void {
  const game = GameFactory.create({
    bootstrap: [Manager],
    screenNumber: response.number,
    width: response.width,
    height: response.height,
    displacement,
  })
  game.start()
}
