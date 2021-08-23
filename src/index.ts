import io from 'socket.io-client/dist/socket.io.js'

import './global.scss'

import { Ball } from './assets/ts/entities/ball'
import { GameFactory } from './assets/ts/game'
import { IScreen } from './assets/ts/interfaces/screen.interface'
import { Vector2 } from './assets/ts/physics/vector2'

const socket = io('http://localhost:8080')

socket.emit(
  'connectScreen',
  window.location.pathname.split('/screen/')[1].split('/')[0],
  window.innerWidth,
  window.innerHeight,
  (response: IScreen) => {
    console.log(response)
    start(response)
  },
)

socket.on('test-index', (arg: string) => {
  console.log(arg)
})

function start(screen: IScreen): void {
  // TODO: pass window sizes as params to setup()
  GameFactory.setup()

  const ball = new Ball(GameFactory.context, 50, new Vector2(100, 100))

  let gameKeys: any = {}

  window.addEventListener('keydown', (e) => {
    gameKeys = gameKeys || []
    gameKeys[e.key] = true
  })
  window.addEventListener('keyup', (e) => {
    gameKeys[e.key] = false
  })

  setInterval(() => {
    let count = 0
    for (const key in gameKeys) {
      if (!gameKeys[key]) {
        count++
      }
      if (count === 4) {
        ball.resultant = new Vector2(0, 0)
      }
    }
    if (gameKeys && gameKeys['ArrowLeft']) {
      ball.resultant = new Vector2(-1, ball.resultant.y)
    }
    if (gameKeys && gameKeys['ArrowRight']) {
      ball.resultant = new Vector2(1, ball.resultant.y)
    }
    if (gameKeys && gameKeys['ArrowUp']) {
      ball.resultant = new Vector2(ball.resultant.x, 1)
    }
    if (gameKeys && gameKeys['ArrowDown']) {
      ball.resultant = new Vector2(ball.resultant.x, -1)
    }
  }, 5)
}
