import {
  AbstractEntity,
  Entity,
  generateUUID,
  IOnStart,
  ISocketData,
  Vector2,
} from '@asteroidsjs'

import { socket } from '../../socket'

import { Asteroid } from './asteroid.entity'

import { RectCollider2 } from '../../components/colliders/rect-collider2.component'
import { Transform } from '../../components/transform.component'

import { AsteroidSizeEnum } from '../../enums/asteroid.enum'

/**
 * Class that represents the first entity to be loaded into the game
 */
@Entity()
export class ManagerAsteroids extends AbstractEntity implements IOnStart {
  public onStart(): void {
    this.generateAsteroid()
  }

  private generateAsteroid(): void {
    const id = generateUUID()
    const sizes = [0, 1, 2, 3, 4]
    const asteroidSize = sizes[Math.floor(Math.random() * sizes.length)]

    const offset = 150

    const canvasWidth = this.game.getContext().canvas.width
    const canvasHeight = this.game.getContext().canvas.height

    let x = Math.floor(Math.random() * (canvasWidth + offset * 2)) - offset
    let y = Math.floor(Math.random() * (canvasHeight + offset * 2)) - offset

    if (x < 0) {
      x = (offset + canvasWidth / 2) * -1
    } else if (x > canvasWidth) {
      x = canvasWidth / 2 + offset
    } else {
      x -= canvasWidth / 2
      y =
        Math.random() <= 0.5
          ? (offset + canvasHeight / 2) * -1
          : canvasHeight / 2 + offset
    }

    this.instantiate({
      use: {
        id,
        asteroidSize: AsteroidSizeEnum.large,
      },
      entity: Asteroid,
      components: [RectCollider2],
      properties: [
        {
          for: Transform,
          use: {
            position: new Vector2(0, 300),
          },
        },
      ],
    })

    socket.emit('instantiate', {
      id,
      type: Asteroid.name,
      data: {
        position: new Vector2(x, y),
        asteroidSize,
      },
    } as ISocketData)
  }
}
