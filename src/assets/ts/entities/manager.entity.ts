import {
  AbstractEntity,
  Entity,
  IOnStart,
  ISocketData,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { LGSocketService } from '../services/lg-socket.service'

import { Asteroid } from './master/asteroid.entity'
import { Bullet } from './master/bullet.entity'
import { ManagerAsteroids } from './master/manager-asteroids.entity'
import { Score } from './master/score.entity'
import { Spaceship } from './master/spaceship.entity'
import { AsteroidVirtual } from './virtual/asteroid-virtual.entity'
import { BulletVirtual } from './virtual/bullet-virtual.entity'
import { SpaceshipVirtual } from './virtual/spaceship-virtual.entity'

import { UserService } from '../services/user.service'

import { Health } from '../components/health.component'

/**
 * Class that represents the first entity to be loaded into the game
 */
@Entity({
  services: [UserService, LGSocketService],
})
export class Manager extends AbstractEntity implements IOnStart {
  private userService: UserService

  private lgSocketService: LGSocketService

  public onStart(): void {
    this.userService = this.getService(UserService)
    this.lgSocketService = this.getService(LGSocketService)

    this.scene.getContext().canvas.width = this.lgSocketService.canvasTotalWidth
    this.scene.getContext().canvas.height =
      this.lgSocketService.canvasTotalHeight
    this.scene.getContext().canvas.style.transform = `translateX(-${this.lgSocketService.displacement}px)`

    if (this.lgSocketService.screen?.number === 1) {
      setTimeout(() => {
        this.master()
      }, 100)
    } else {
      this.virtual()
    }
  }

  private master(): void {
    const color = window.localStorage.getItem('asteroidsjs_spaceship_color')
    const nickname = window.localStorage.getItem('asteroidsjs_nickname')

    if (nickname) {
      this.userService.nickname = nickname.toUpperCase()
    }

    if (color) {
      this.userService.spaceshipColor = JSON.parse(color).rgb as string
      this.userService.spaceshipImage = JSON.parse(color).name as string
    }

    this.instantiate({
      entity: ManagerAsteroids,
    })

    this.instantiate({
      entity: Score,
    })

    const spaceship = this.instantiate({
      entity: Spaceship,
      components: [
        {
          id: '__spaceship_transform__',
          use: {
            rotation: 0,
            dimensions: new Rect(50, 50),
          },
        },
        {
          id: '__spaceship_rigidbody__',
          use: {
            friction: 0.00003,
            mass: 10,
            maxVelocity: 0.8,
            maxAngularVelocity: 0.09,
          },
        },
        {
          class: Health,
          use: {
            maxHealth: 30,
            health: 30,
          },
        },
      ],
    })

    this.lgSocketService.emit('instantiate', {
      id: spaceship.id,
      type: Spaceship.name,
      data: {
        position: new Vector2(),
        dimensions: new Rect(50, 50),
        spaceshipColor: this.userService.spaceshipColor,
        nickname: this.userService.nickname,
        imageSrc: `./assets/svg/spaceship-${this.userService.spaceshipImage}.svg`,
        maxHealth: 30,
        health: 30,
      },
    } as ISocketData)
  }

  private virtual(): void {
    this.lgSocketService
      .on<ISocketData>('instantiate')
      .subscribe(({ id, type, data }) => {
        switch (type) {
          case Spaceship.name:
            this.instantiate({
              use: {
                id,
                spaceshipColor: data.spaceshipColor,
                nickname: data.nickname,
                imageSrc: data.imageSrc,
              },
              entity: SpaceshipVirtual,
              components: [
                {
                  id: '__spaceship_virtual_transform__',
                  use: {
                    rotation: data.rotation,
                    position: data.position,
                    dimensions: data.dimensions,
                  },
                },
                {
                  class: Health,
                  use: {
                    color: data.spaceshipColor,
                    maxHealth: data.maxHealth,
                    health: data.health,
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
              components: [
                {
                  id: '__bullet_virtual_transform__',
                  use: {
                    rotation: data.rotation,
                    position: data.position,
                    dimensions: new Rect(2, 14),
                  },
                },
                {
                  id: '__bullet_virtual_rigidbody__',
                  use: {
                    velocity: data.velocity,
                    mass: 3,
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
