import './global.scss'
import 'reflect-metadata'
import './assets/ts/menu.ts'

import { AsteroidsFactory } from '@asteroidsjs'

import { socket } from './assets/ts/socket'

import { Manager } from './assets/ts/entities/manager.entity'

import { IScreen } from '../libs/asteroidsjs/src/interfaces/screen.interface'

const connectScreenData = {
  number: window.location.pathname.split('/screen/')[1].split('/')[0],
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Connects the current screen to the socket screen.
 *
 * @param response - The screen information.
 */
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

  /**
   * Configures the canvas total size and it's displacement.
   */
  function startGame(): void {
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
  }
  socket.on('start-game', startGame)
}
socket.emit('connect-screen', connectScreenData, connectScreen)

/**
 * Creates and starts the game.
 *
 * @param response - The master screen data.
 * @param displacement - The canvas displacement.
 */
function bootstrap(response: IScreen, displacement: number): void {
  const game = AsteroidsFactory.create({
    bootstrap: [Manager],
    screen: response,
    displacement,
  })
  game.start()
}

// bootstrap: [Manager],
// screenNumber: response.number,
// width: response.width,
// height: response.height,
// displacement,
