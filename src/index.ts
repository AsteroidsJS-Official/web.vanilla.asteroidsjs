import './global.scss'
import { Ball } from './assets/ts/entities/ball'
import { GameFactory } from './assets/ts/game'
import { Vector2 } from './assets/ts/physics/vector2'

GameFactory.setup()

const ball = new Ball(GameFactory.context, 100, new Vector2(100, 100))
ball.velocity = new Vector2(3, 3)
ball.resultant = new Vector2(1, -1)

// y + height / 2

// setTimeout(() => {
//   ball.resultant = new Vector2(-1, -1)
// }, 5000)
