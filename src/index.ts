import './global.scss'

import { Entity } from './assets/ts/engine/core/entity'
import { GameFactory } from './assets/ts/engine/game.factory'
import { Manager } from './assets/ts/entities/manager.entity'

GameFactory.create({ entities: [Entity.instantiate(Manager)] })
GameFactory.start()
