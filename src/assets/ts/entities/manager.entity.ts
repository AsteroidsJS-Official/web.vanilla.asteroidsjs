import {
  AbstractEntity,
  Entity,
  generateUUID,
  IOnStart,
  ISocketData,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { socket } from '../socket'

import { Asteroid } from './master/asteroid.entity'
import { Bullet } from './master/bullet.entity'
import { ManagerAsteroids } from './master/manager-asteroids.entity'
import { Spaceship } from './master/spaceship.entity'
import { AsteroidVirtual } from './virtual/asteroid-virtual.entity'
import { BulletVirtual } from './virtual/bullet-virtual.entity'
import { SpaceshipVirtual } from './virtual/spaceship-virtual.entity'

import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'

/**
 * Class that represents the first entity to be loaded into the game
 */
@Entity()
export class Manager extends AbstractEntity implements IOnStart {
  public onStart(): void {
    if (this.game.getScreen().number === 1) {
      setTimeout(() => {
        this.master()
      }, 100)
    } else {
      this.virtual()
    }
  }

  private master(): void {
    this.instantiate({
      entity: ManagerAsteroids,
    })

    const id = generateUUID()

    this.instantiate({
      use: {
        id,
        tag: `${Spaceship.name}|${id}`,
      },
      entity: Spaceship,
      properties: [
        {
          for: Transform,
          use: {
            rotation: 0,
            dimensions: new Rect(50, 50),
          },
        },
        {
          for: Rigidbody,
          use: {
            friction: 0.03,
            mass: 10,
            maxVelocity: 8,
            maxAngularVelocity: 0.09,
          },
        },
      ],
    })

    socket.emit('instantiate', {
      id,
      type: Spaceship.name,
      data: {
        position: new Vector2(),
        dimensions: new Rect(50, 50),
      },
    } as ISocketData)
  }

  private virtual(): void {
    socket.on('instantiate', ({ id, type, data }: ISocketData) => {
      switch (type) {
        case Spaceship.name:
          this.instantiate({
            use: {
              id,
            },
            entity: SpaceshipVirtual,
            properties: [
              {
                for: Transform,
                use: {
                  rotation: data.rotation,
                  position: data.position,
                  dimensions: data.dimensions,
                },
              },
            ],
          })
          break
        case Bullet.name:
          this.instantiate({
            use: {
              id,
            },
            entity: BulletVirtual,
            properties: [
              {
                for: Transform,
                use: {
                  rotation: data.rotation,
                  position: data.position,
                },
              },
              {
                for: Rigidbody,
                use: {
                  velocity: data.velocity,
                },
              },
            ],
          })
          break
        case Asteroid.name:
          this.instantiate({
            use: {
              id,
              asteroidSize: data.asteroidSize,
            },
            entity: AsteroidVirtual,
            properties: [
              {
                for: Transform,
                use: {
                  rotation: data.rotation,
                  position: data.position,
                },
              },
            ],
          })
          break
      }
    })
  }
}
