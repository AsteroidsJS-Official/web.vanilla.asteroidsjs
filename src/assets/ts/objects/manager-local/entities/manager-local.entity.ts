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

import { ScoreMultiplayer } from '../../../ui/score/entities/score-multiplayer.entity'
import { AsteroidVirtual } from '../../asteroid/entities/asteroid-virtual.entity'
import { Asteroid } from '../../asteroid/entities/asteroid.entity'
import { ManagerAsteroids } from '../../asteroid/entities/manager-asteroids.entity'
import { BulletVirtual } from '../../bullet/entities/bullet-virtual.entity'
import { Bullet } from '../../bullet/entities/bullet.entity'
import { PowerUpVirtual } from '../../power-up/entities/power-up-virtual.entity'
import { PowerUp } from '../../power-up/entities/power-up.entity'
import { SpaceshipVirtual } from '../../spaceship/entities/spaceship-virtual.entity'
import { Spaceship } from '../../spaceship/entities/spaceship.entity'

import { GameService } from '../../../shared/services/game.service'
import { MultiplayerService } from '../../../shared/services/multiplayer.service'
import { UserService } from '../../../shared/services/user.service'

import { AudioSource } from '../../../shared/components/audio-source.component'
import { Transform } from '../../../shared/components/transform.component'
import { Input } from '../../spaceship/components/input.component'

import { IPlayer } from '../../../shared/interfaces/player.interface'

import { Menu } from '../../../scenes/menu.scene'
import { Subscription } from 'rxjs'

/**
 * Class that represents the local multiplayer game manager.
 */
@Entity({
  services: [
    GameService,
    LGSocketService,
    MultiplayerService,
    SocketService,
    UserService,
  ],
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
export class ManagerLocal
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private gameService: GameService

  private lgSocketService: LGSocketService

  private multiplayerService: MultiplayerService

  private socketService: SocketService

  private userService: UserService

  private connectionSubscription: Subscription

  private controllerStatusSub: Subscription

  private disconnectionSubscription: Subscription

  private instantiateSubscription: Subscription

  private lobbySubscription: Subscription

  private respawnSubscription: Subscription

  /**
   * Property that contains the manager sound effects.
   */
  private audioSource: AudioSource

  /**
   * Property that keeps all local multiplayer instantiated spaceships.
   */
  private spaceships: { [id: string]: Spaceship } = {}

  onAwake(): void {
    this.gameService = this.getService(GameService)
    this.lgSocketService = this.getService(LGSocketService)
    this.multiplayerService = this.getService(MultiplayerService)
    this.socketService = this.getService(SocketService)
    this.userService = this.getService(UserService)

    this.audioSource = this.getComponent(AudioSource)
  }

  onStart(): void {
    this.getContexts()[0].canvas.width = this.lgSocketService.canvasTotalWidth
    this.getContexts()[0].canvas.height = this.lgSocketService.canvasTotalHeight
    this.getContexts()[0].canvas.style.transform = `translateX(-${this.lgSocketService.displacement}px)`

    if (this.lgSocketService.screen?.number === 1) {
      this.master()
    } else {
      this.virtual()
    }
  }

  onDestroy(): void {
    this.connectionSubscription?.unsubscribe()
    this.controllerStatusSub?.unsubscribe()
    this.disconnectionSubscription?.unsubscribe()
    this.instantiateSubscription?.unsubscribe()
    this.lobbySubscription?.unsubscribe()
    this.respawnSubscription?.unsubscribe()
  }

  /**
   * Manages the game in master screen.
   */
  private master(): void {
    this.multiplayerService.openLobby()

    this.audioSource.play('./assets/audios/space-ambient.mp3')

    this.gameService.maxAsteroidsAmount = 5

    this.instantiate({ entity: ScoreMultiplayer })
    this.instantiate({ entity: ManagerAsteroids })

    this.connectionSubscription = this.multiplayerService
      .listenConnections()
      .subscribe((player) => {
        this.spaceships[player.id] = this.instantiateSpaceship(player)

        if (player.isMaster) {
          this.controllerStatusSub = this.socketService
            .emit<unknown, string | null>('master-controller-status')
            .subscribe((masterController) => {
              if (masterController) {
                this.userService.userId = masterController.split('|')[1]
                this.spaceships[player.id].userId =
                  masterController.split('|')[1]
                this.spaceships[player.id].joystickId =
                  masterController.split('|')[1]

                this.spaceships[player.id]?.getComponent(Input)?.listenKeys()
              }
            })
        }
      })

    this.respawnSubscription = this.multiplayerService
      .listenPlayerRespawns()
      .subscribe((rspPlayer) => {
        const spaceship = this.spaceships[rspPlayer.id]

        if (spaceship) {
          this.spaceships[rspPlayer.id] = this.instantiateSpaceship(rspPlayer)
        }
      })

    this.disconnectionSubscription = this.multiplayerService
      .listenDisconnections()
      .subscribe((dcPlayer) => {
        if (dcPlayer.isMaster) {
          this.multiplayerService.closeLobby()
          this.scene.unload(this.scene)
          this.scene.load(Menu)
        }

        const spaceship = this.spaceships[dcPlayer.id]

        if (spaceship) {
          this.destroy(spaceship)
        }
      })
  }

  /**
   * Manages the game in slave screens.
   */
  private virtual(): void {
    this.lobbySubscription = this.socketService
      .on('close-lobby')
      .subscribe(() => {
        this.scene.unload(this.scene)
        this.scene.load(Menu)
      })

    this.instantiateSubscription = this.socketService
      .on<ISocketData>('instantiate')
      .subscribe(({ id, type, data }) => {
        switch (type) {
          case Spaceship.name:
            this.instantiate({
              entity: SpaceshipVirtual,
              use: {
                id,
                spaceshipColor: data.spaceshipColor,
                nickname: data.nickname,
                imageSrc: data.imageSrc,
              },
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
              entity: BulletVirtual,
              use: {
                id,
                userId: data.userId,
              },
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
          case PowerUp.name:
            this.instantiate({
              entity: PowerUpVirtual,
              use: {
                id,
                name: data.powerUp.name,
                type: data.powerUp.type,
              },
              components: [
                {
                  id: '__power_up_transform__',
                  use: {
                    position: data.position,
                  },
                },
                {
                  id: '__power_up_rigidbody__',
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

  /**
   * Instantiates a new spaceship with the given player data.
   *
   * @param player The player data.
   * @returns A spaceship entity with all player data.
   */
  private instantiateSpaceship(player: IPlayer): Spaceship {
    const canvasHeight = this.getContexts()[0].canvas.height
    const canvasWidth = this.getContexts()[0].canvas.width

    const playerPosition = new Vector2(
      Math.floor(Math.random() * canvasWidth) - canvasWidth / 2,
      Math.floor(Math.random() * canvasHeight) - canvasHeight / 2,
    )

    const spaceship = this.instantiate({
      entity: Spaceship,
      use: {
        imageSrc: `./assets/svg/spaceship-${player.spaceship.colorName}.svg`,
        joystickId: player.id,
        userId: player.id,
      },
      components: [
        {
          id: '__spaceship_transform__',
          use: {
            position: playerPosition,
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
            maxHealth: player.health,
            health: player.health,
            color: player.spaceship.color,
          },
        },
      ],
    })

    this.socketService.emit('instantiate', {
      id: spaceship.id,
      type: Spaceship.name,
      data: {
        position: playerPosition,
        dimensions: new Rect(50, 50),
        spaceshipColor: player.spaceship.color,
        nickname: player.nickname,
        imageSrc: `./assets/svg/spaceship-${player.spaceship.colorName}.svg`,
        maxHealth: spaceship.health.health,
        health: spaceship.health.maxHealth,
      },
    })

    return spaceship
  }
}
