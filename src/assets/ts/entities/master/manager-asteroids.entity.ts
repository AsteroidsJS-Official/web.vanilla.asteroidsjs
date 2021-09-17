import {
  Entity,
  AbstractEntity,
  IOnStart,
  Vector2,
  ISocketData,
  IOnDestroy,
  IOnAwake,
} from '@asteroidsjs'

import { LGSocketService } from '../../services/lg-socket.service'

import { AsteroidVirtual } from '../virtual/asteroid-virtual.entity'
import { Asteroid } from './asteroid.entity'

/**
 * Class that represents the first entity to be loaded into the game
 */
@Entity({
  services: [LGSocketService],
})
export class ManagerAsteroids
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private interval: ReturnType<typeof setInterval>

  private lgSocketService: LGSocketService

  public isMenu = false

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
  }

  onStart(): void {
    if (!this.isMenu) {
      for (let i = 0; i < 3; i++) {
        this.generateAsteroid()
      }
      this.interval = setInterval(() => {
        this.generateAsteroid()
        this.generateAsteroid()
      }, 10000)
    } else {
      const screen = this.lgSocketService.screen

      if (!screen) {
        return
      }

      if (screen.number === 1) {
        setTimeout(() => {
          for (let i = 0; i < 4; i++) {
            this.generateAsteroid()
          }
        }, 100)
      } else {
        this.listenForAsteroids()
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
      0.1 * Math.floor(Math.random() * (5 - asteroidSize + 1 - 2) + 2) * -0.5,
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
            maxAngularVelocity: 0.006,
            angularVelocity: 0.05 / (asteroidSize + 1),
          },
        },
      ],
    })

    this.lgSocketService.emit('instantiate', {
      id: asteroid.id,
      type: Asteroid.name,
      data: {
        position: new Vector2(x, y),
        rotation,
        asteroidSize,
        image: asteroid.image.src,
        velocity,
        mass: 15 * (asteroidSize + 1),
        maxAngularVelocity: 0.006,
        angularVelocity: 0.05 / (asteroidSize + 1),
      },
    } as ISocketData)
  }

  private listenForAsteroids(): void {
    this.lgSocketService
      .on<ISocketData>('instantiate')
      .subscribe(({ id, type, data }) => {
        switch (type) {
          case Asteroid.name:
            this.instantiate({
              use: {
                id,
                asteroidSize: data.asteroidSize,
                image: data.image,
                isFragment: !!data.isFragment,
              },
              entity: AsteroidVirtual,
              components: [
                {
                  id: '__asteroid_virtual_transform__',
                  use: {
                    rotation: data.rotation,
                    position: data.position,
                  },
                },
                {
                  id: '__asteroid_virtual_rigidbody__',
                  use: {
                    velocity: data.velocity,
                    mass: data.mass,
                    maxAngularVelocity: data.maxAngularVelocity,
                    angularVelocity: data.angularVelocity,
                  },
                },
              ],
            })
            break
        }
      })
  }
}
