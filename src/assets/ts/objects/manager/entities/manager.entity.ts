import {
  AbstractEntity,
  Entity,
  IOnAwake,
  IOnDestroy,
  IOnStart,
  ISocketData,
  Rect,
  Vector2,
} from '@asteroidsjs'

import { LGSocketService } from '../../../shared/services/lg-socket.service'
import { SocketService } from '../../../shared/services/socket.service'

import { GameOver } from '../../../ui/game-over/entities/game-over.entity'
import { Score } from '../../../ui/score/entities/score.entity'
import { AsteroidVirtual } from '../../asteroid/entities/asteroid-virtual.entity'
import { Asteroid } from '../../asteroid/entities/asteroid.entity'
import { ManagerAsteroids } from '../../asteroid/entities/manager-asteroids.entity'
import { BulletVirtual } from '../../bullet/entities/bullet-virtual.entity'
import { Bullet } from '../../bullet/entities/bullet.entity'
import { SpaceshipVirtual } from '../../spaceship/entities/spaceship-virtual.entity'
import { Spaceship } from '../../spaceship/entities/spaceship.entity'

import { GameService } from '../../../shared/services/game.service'
import { UserService } from '../../../shared/services/user.service'

import { AudioSource } from '../../../shared/components/audio-source.component'
import { Transform } from '../../../shared/components/transform.component'

import { Subscription } from 'rxjs'

/**
 * Class that represents the first entity to be loaded into the game.
 */
@Entity({
  services: [UserService, LGSocketService, SocketService, GameService],
  components: [
    Transform,
    {
      class: AudioSource,
      use: {
        loop: true,
      },
    },
  ],
})
export class Manager
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private userService: UserService

  private lgSocketService: LGSocketService

  private socketService: SocketService

  private gameService: GameService

  private gameOverSubscription: Subscription

  /**
   * Property that contains the manager sound effects.
   */
  private audioSource: AudioSource

  onAwake(): void {
    this.userService = this.getService(UserService)
    this.lgSocketService = this.getService(LGSocketService)
    this.socketService = this.getService(SocketService)
    this.gameService = this.getService(GameService)

    this.audioSource = this.getComponent(AudioSource)
  }

  onStart(): void {
    this.getContexts()[0].canvas.width = this.lgSocketService.canvasTotalWidth
    this.getContexts()[0].canvas.height = this.lgSocketService.canvasTotalHeight
    this.getContexts()[0].canvas.style.transform = `translateX(-${this.lgSocketService.displacement}px)`

    if (this.lgSocketService.screen?.number === 1) {
      setTimeout(() => {
        this.master()
      }, 100)
    } else {
      this.virtual()
    }
  }

  onDestroy(): void {
    this.gameOverSubscription?.unsubscribe()
  }

  /**
   * Manages the game in master screen.
   */
  private master(): void {
    this.gameOverSubscription = this.gameService.gameOver$.subscribe(
      (isGameOver) => {
        if (isGameOver) {
          this.instantiate({ entity: GameOver })

          this.socketService.emit('game-over', this.userService.player)
        }
      },
    )

    this.audioSource.play('./assets/audios/space-ambient.mp3')

    this.gameService.maxAsteroidsAmount = 10

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
      entity: Score,
    })

    const spaceshipHealth = 30

    const spaceship = this.instantiate({
      entity: Spaceship,
      use: {
        imageSrc: `./assets/svg/spaceship-${this.userService.spaceshipImage}.svg`,
        userId: this.userService.userId,
      },
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
            maxVelocity: 0.5,
            maxAngularVelocity: 0.007,
          },
        },
        {
          id: '__spaceship_health__',
          use: {
            maxHealth: spaceshipHealth,
            health: spaceshipHealth,
            color: this.userService.spaceshipColor,
          },
        },
      ],
    })

    this.instantiate({
      entity: ManagerAsteroids,
    })

    this.socketService.emit('instantiate', {
      id: spaceship.id,
      type: Spaceship.name,
      data: {
        position: new Vector2(),
        dimensions: new Rect(50, 50),
        spaceshipColor: this.userService.spaceshipColor,
        nickname: this.userService.nickname,
        imageSrc: `./assets/svg/spaceship-${this.userService.spaceshipImage}.svg`,
        maxHealth: spaceshipHealth,
        health: spaceshipHealth,
      },
    } as ISocketData)
  }

  /**
   * Manages the game in slave screens.
   */
  private virtual(): void {
    this.gameOverSubscription = this.socketService
      .on('game-over')
      .subscribe(() => {
        this.instantiate({ entity: GameOver })
      })

    this.socketService
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
                  id: '__spaceship_virtual_health__',
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
                userId: data.userId,
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
                imageSrc: data.image,
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
                {
                  id: '__asteroid_virtual_health__',
                  use: {
                    color: data.color,
                    maxHealth: data.maxHealth,
                    health: data.health,
                  },
                },
              ],
            })
            break
        }
      })
  }
}
