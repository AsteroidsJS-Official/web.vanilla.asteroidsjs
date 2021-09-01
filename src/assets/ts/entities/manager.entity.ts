import { ISocketData } from '../interfaces/socket-data.interface'
import { socket } from '../socket'

import { Rect } from '../engine/math/rect'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { Vector2 } from '../engine/math/vector2'

import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { AsteroidVirtual } from './asteroid-virtual.entity'
import { Asteroid } from './asteroid.entity'
import { BulletVirtual } from './bullet-virtual.entity'
import { Bullet } from './bullet.entity'
import { ManagerAsteroids } from './manager-asteroids.entity'
import { SpaceshipVirtual } from './spaceship-virtual.entity'
import { Spaceship } from './spaceship.entity'

import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'

import { IOnStart } from '../engine/interfaces/on-start.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'

import { uuid } from '../engine/utils/validations'

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

    const id = uuid()

    this.instantiate({
      use: {
        id,
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
