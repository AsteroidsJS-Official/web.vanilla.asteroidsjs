import './global.scss'

import { AvoidOverflow } from './assets/ts/engine/components/avoid-overflow.component'
import { Image } from './assets/ts/engine/components/image.component'
import { Render } from './assets/ts/engine/components/render.component'
import { Rigidbody } from './assets/ts/engine/components/rigidbody.component'
import { Transform } from './assets/ts/engine/components/transform.component'
import { Entity } from './assets/ts/engine/core/entity'
import { GameFactory } from './assets/ts/engine/game.factory'
import { Ball } from './assets/ts/entities/ball.entity'
import { Spaceship } from './assets/ts/entities/spaceship.entity'

GameFactory.setup({
  entities: [
    Entity.create(Ball, [Image, Rigidbody, Transform, AvoidOverflow]),
    Entity.create(Spaceship, [Image, Rigidbody, Transform, Render]),
  ],
})
GameFactory.start()
