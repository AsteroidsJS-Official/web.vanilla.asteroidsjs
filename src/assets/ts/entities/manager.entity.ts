import {
  AbstractEntity,
  Entity,
  IOnStart,
  ISocketData,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { socket } from '../socket'

import { BulletVirtual } from './bullet-virtual.entity'
import { Bullet } from './bullet.entity'
import { SpaceshipVirtual } from './spaceship-virtual.entity'
import { Spaceship } from './spaceship.entity'

import { Health } from '../components/health.component'
import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'

import { uuid } from '../../../../libs/asteroidsjs/src/utils/validations'

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

    const color = window.localStorage.getItem('asteroidsjs_spaceship_color')
    let nickname = window.localStorage.getItem('asteroidsjs_nickname')
    nickname = nickname ? nickname.toUpperCase() : 'GUEST'

    let imageSrc = ''
    let spaceshipColor = ''

    if (color) {
      spaceshipColor = JSON.parse(color).rgb
      imageSrc = `./assets/svg/spaceship-${JSON.parse(color).name}.svg`
    } else {
      spaceshipColor = '#888888'
      imageSrc = './assets/svg/spaceship-grey.svg'
    }

    this.instantiate({
      use: {
        id,
        spaceshipColor,
        nickname,
        imageSrc,
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
            friction: 0.005,
            mass: 10,
            maxAngularVelocity: 0.09,
          },
        },
        {
          for: Health,
          use: {
            color: spaceshipColor,
            maxHealth: 30,
            health: 30,
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
