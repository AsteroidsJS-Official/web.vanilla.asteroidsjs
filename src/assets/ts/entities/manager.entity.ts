import { ISocketData } from '../interfaces/socket-data.interface'
import { socket } from '../socket'

import { uuid } from '../engine/utils/validations'

import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'
import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { BulletVirtual } from './bullet-virtual.entity'
import { Bullet } from './bullet.entity'
import { SpaceshipVirtual } from './spaceship-virtual.entity'
import { Spaceship } from './spaceship.entity'

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
            position: new Vector2(),
            dimensions: new Rect(50, 50),
          },
        },
        {
          for: Rigidbody,
          use: {
            friction: 0.005,
            mass: 10,
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
      }
    })
  }
}
