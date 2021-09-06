import { ISocketData } from '../interfaces/socket-data.interface'
import { socket } from '../socket'

import { Vector2 } from '../engine/math/vector2'

import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { Asteroid } from './asteroid.entity'

import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'

import { IOnStart } from '../engine/interfaces/on-start.interface'

import { uuid } from '../engine/utils/validations'

/**
 * Class that represents the first entity to be loaded into the game
 */
@Entity()
export class ManagerAsteroids extends AbstractEntity implements IOnStart {
  public onStart(): void {
    for (let i = 0; i < 3; i++) {
      this.generateAsteroid()
    }
    setInterval(() => {
      this.generateAsteroid()
    }, 10000)
  }

  private generateAsteroid(): void {
    const id = uuid()
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

    const rotation = Math.random() * 2 * Math.PI

    const velocity = Vector2.multiply(new Vector2(x, y).normalized, -2)

    const asteroid = this.instantiate({
      use: {
        id,
        asteroidSize,
      },
      entity: Asteroid,
      properties: [
        {
          for: Transform,
          use: {
            rotation,
            position: new Vector2(x, y),
          },
        },
        {
          for: Rigidbody,
          use: {
            velocity,
            friction: 0,
            mass: 15 * (asteroidSize + 1),
            maxAngularVelocity: 0.09,
            angularVelocity: 0.05 / (asteroidSize + 1),
          },
        },
      ],
    })

    socket.emit('instantiate', {
      id,
      type: Asteroid.name,
      data: {
        position: new Vector2(x, y),
        rotation,
        asteroidSize,
        image: asteroid.image.src,
      },
    } as ISocketData)
  }
}
