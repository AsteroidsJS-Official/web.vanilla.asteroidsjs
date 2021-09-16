import {
  Entity,
  AbstractEntity,
  IOnStart,
  Vector2,
  ISocketData,
  IOnDestroy,
} from '@asteroidsjs'

import { socket } from '../../socket'

import { Asteroid } from './asteroid.entity'

/**
 * Class that represents the first entity to be loaded into the game
 */
@Entity()
export class ManagerAsteroids
  extends AbstractEntity
  implements IOnStart, IOnDestroy
{
  private interval: ReturnType<typeof setInterval>

  public isMenu = false

  public onStart(): void {
    if (!this.isMenu) {
      for (let i = 0; i < 3; i++) {
        this.generateAsteroid()
      }

      this.interval = setInterval(() => {
        this.generateAsteroid()
        this.generateAsteroid()
      }, 10000)
    } else {
      for (let i = 0; i < 6; i++) {
        this.generateAsteroid()
      }
    }
  }

  onDestroy(): void {
    clearInterval(this.interval)
  }

  private generateAsteroid(): void {
    const sizes = [0, 1, 2, 3, 4]
    const asteroidSize = sizes[Math.floor(Math.random() * sizes.length)]

    const offset = 150

    const canvasWidth = this.getContext().canvas.width
    const canvasHeight = this.getContext().canvas.height

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

    const velocity = Vector2.multiply(
      new Vector2(x, y).normalized,
      Math.floor(Math.random() * (5 - asteroidSize + 1 - 2) + 2) * -1,
    )

    const asteroid = this.instantiate({
      use: {
        asteroidSize,
      },
      entity: Asteroid,
      components: [
        {
          id: '__asteroid_transform__',
          use: {
            rotation,
            position: new Vector2(x, y),
          },
        },
        {
          id: '__asteroid_rigidbody__',
          use: {
            velocity,
            mass: 15 * (asteroidSize + 1),
            maxAngularVelocity: 0.09,
            angularVelocity: 0.05 / (asteroidSize + 1),
          },
        },
      ],
    })

    socket.emit('instantiate', {
      id: asteroid.id,
      type: Asteroid.name,
      data: {
        position: new Vector2(x, y),
        rotation,
        asteroidSize,
        image: asteroid.image.src,
        velocity,
        mass: 15 * (asteroidSize + 1),
        maxAngularVelocity: 0.09,
        angularVelocity: 0.05 / (asteroidSize + 1),
      },
    } as ISocketData)
  }
}
