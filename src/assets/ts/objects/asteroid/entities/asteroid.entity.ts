import {
  Entity,
  AbstractEntity,
  IOnAwake,
  IOnStart,
  IDraw,
  IOnLoop,
  IOnDestroy,
  Rect,
  isOverflowingX,
  isOverflowingY,
  Vector2,
  getRandom,
} from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import { Bullet } from '../../bullet/entities/bullet.entity'
import { PowerUp } from '../../power-up/entities/power-up.entity'

import { GameService } from '../../../shared/services/game.service'
import { MultiplayerService } from '../../../shared/services/multiplayer.service'
import { UserService } from '../../../shared/services/user.service'

import { AudioSource } from '../../../shared/components/audio-source.component'
import { CircleCollider2 } from '../../../shared/components/colliders/circle-collider2.component'
import { Drawer } from '../../../shared/components/drawer.component'
import { Health } from '../../../shared/components/health.component'
import { RenderOverflow } from '../../../shared/components/renderers/render-overflow.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Rigidbody } from '../../../shared/components/rigidbody/rigidbody.component'
import { Transform } from '../../../shared/components/transform.component'

import { ICollision2 } from '../../../shared/interfaces/collision2.interface'
import { IOnTriggerEnter } from '../../../shared/interfaces/on-trigger-enter.interface'

/**
 * Class that represents the asteroid entity and its behavior.
 */
@Entity({
  services: [UserService, GameService, SocketService, MultiplayerService],
  components: [
    Render,
    Drawer,
    CircleCollider2,
    AudioSource,
    {
      id: '__asteroid_transform__',
      class: Transform,
    },
    {
      id: '__asteroid_rigidbody__',
      class: Rigidbody,
    },
    {
      id: '__asteroid_health__',
      class: Health,
    },
  ],
})
export class Asteroid
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw, IOnLoop, IOnDestroy, IOnTriggerEnter
{
  private userService: UserService

  private socketService: SocketService

  private multiplayerService: MultiplayerService

  private gameService: GameService

  /**
   * Property that contains the asteroid position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property that contains the asteroid health status.
   */
  private health: Health

  /**
   * Property that contains the asteroid sound effects.
   */
  private audioSource: AudioSource

  /**
   * Property that defines the asteroid tag.
   */
  public tag = Asteroid.name

  /**
   * Property that defines the asteroid size.
   *
   * @example
   * [0, 1, 2, 3, 4] => 2
   */
  private _asteroidSize: number

  /**
   * Property that defines the group id that was hit.
   */
  private hitGroup: string

  /**
   * Property that defines the asteroid image.
   */
  public image: HTMLImageElement

  /**
   * Property that defines whether the asteroid is a fragment from
   * another one.
   */
  public isFragment = false

  /**
   * Property that defines whether the asteroid is powered, meaning
   * it will release a power up when destroyed.
   */
  public isPowered = false

  /**
   * Property that defines the asteroid cracks color when it's
   * powered.
   */
  public color = ''

  /**
   * Property that defines the time that the asteroid was generated.
   */
  public generationTime: Date

  public get asteroidSize(): number {
    return this._asteroidSize
  }

  public set asteroidSize(size: number) {
    this._asteroidSize = size
  }

  public onAwake(): void {
    this.userService = this.getService(UserService)
    this.socketService = this.getService(SocketService)
    this.gameService = this.getService(GameService)
    this.multiplayerService = this.getService(MultiplayerService)

    this.transform = this.getComponent(Transform)
    this.health = this.getComponent(Health)
    this.audioSource = this.getComponent(AudioSource)
  }

  public onStart(): void {
    this.generationTime = new Date()

    if (this.getComponent(Render) || this.getComponent(RenderOverflow)) {
      this.image = new Image()
      if (this._asteroidSize === 0) {
        this.image.src = './assets/svg/asteroid-xs.svg'
      } else if (this._asteroidSize === 1) {
        const smallAsteroids = [1, 2]

        this.image.src = `./assets/svg/asteroid-sm-${getRandom(
          smallAsteroids,
        )}.svg`
      } else if (this._asteroidSize === 2) {
        const mediumAsteroids = [1, 2]

        this.image.src = `./assets/svg/asteroid-md-${getRandom(
          mediumAsteroids,
        )}.svg`
      } else {
        const largeAsteroids = [1, 2, 3]

        this.image.src = `./assets/svg/asteroid-lg-${getRandom(
          largeAsteroids,
        )}${this.isPowered ? '-powered-' + this.color : ''}.svg`
      }
    }

    this.transform.dimensions = new Rect(
      10 * ((this._asteroidSize + 2) * 2),
      10 * ((this._asteroidSize + 2) * 2),
    )

    this.health.health$.subscribe((value) => {
      this.socketService.emit('change-health', { id: this.id, amount: value })
    })
  }

  public onDestroy(): void {
    if (this.isPowered) {
      const rotation = Math.random() * 2 * Math.PI
      const direction = new Vector2(Math.sin(rotation), Math.cos(rotation))

      const velocity = Vector2.multiply(direction.normalized, 0.05)

      const powerUps = [
        {
          isPassive: true,
          hasLifeTime: true,
          lifeTime: 4,
          name: 'repair',
          type: 'health',
          affectValue: 10,
          acquireSound: './assets/audios/power-up-repair.mp3',
        },
        {
          isPassive: true,
          hasLifeTime: true,
          lifeTime: 4,
          name: 'armor',
          type: 'health',
          affectValue: 20,
        },
        {
          isPassive: true,
          hasLifeTime: true,
          lifeTime: 4,
          name: 'rapid-fire',
          type: 'weapon',
          affectValue: 2,
          duration: 5,
        },
      ]

      this.instantiate({
        entity: PowerUp,
        use: getRandom(powerUps) as PowerUp,
        components: [
          {
            id: '__power_up_transform__',
            use: {
              position: this.transform.position,
            },
          },
          {
            id: '__power_up_rigidbody__',
            use: {
              velocity,
            },
          },
        ],
      })
    }

    this.socketService.emit('destroy', this.id)
  }

  public onTriggerEnter(collision: ICollision2): void {
    if (
      !this.enabled ||
      collision.entity2.tag?.includes(Asteroid.name) ||
      collision.entity2.tag?.includes(PowerUp.name)
    ) {
      return
    }

    const generationDiff =
      this.generationTime &&
      new Date().getTime() - this.generationTime.getTime()

    if (collision.entity2.tag?.includes(Bullet.name)) {
      const bullet = collision.entity2 as unknown as Bullet

      this.destroy(bullet)

      if (generationDiff <= 100 / this.timeScale) {
        return
      }

      if (!this.hitGroup || this.hitGroup !== bullet.groupId) {
        this.hitGroup = bullet.groupId
        this.audioSource.playOneShot(
          `./assets/audios/${bullet.hitSound}`,
          this.transform.position,
          0.3,
        )
      }

      this.health.hurt(20)
    } else if (generationDiff > 100 / this.timeScale) {
      this.health.hurt(this.health.maxHealth)
    }

    if (this.health.health > 0) {
      return
    }

    if (collision.entity2.tag?.includes(Bullet.name)) {
      if (
        this.gameService.isInLocalMPGame ||
        this.gameService.isConnectedToRoom
      ) {
        const bullet = collision.entity2 as unknown as Bullet
        this.multiplayerService.increasePlayerScore(
          bullet.userId,
          this._asteroidSize + 1,
        )
      } else {
        this.userService.increaseScore(this._asteroidSize + 1)
      }
    }

    if (this._asteroidSize > 0) {
      this.generateAsteroidFragments(this._asteroidSize <= 2 ? 1 : 2)
    }

    this.gameService.asteroidsAmount -= 1

    this.destroy(this)
  }

  public onLoop(): void {
    const overflowingX = isOverflowingX(
      this.getContexts()[0].canvas.width,
      this.transform.position.x,
      this.transform.totalDimensions.width,
    )
    const overflowingY = isOverflowingY(
      this.getContexts()[0].canvas.height,
      this.transform.position.y,
      this.transform.totalDimensions.height,
    )

    if (
      this.getComponent(Render) &&
      !this.getComponent(RenderOverflow) &&
      (this.isFragment || (!overflowingX && !overflowingY))
    ) {
      this.addComponent(RenderOverflow)
      this.destroy(this.getComponent(Render))
    }
  }

  public draw(): void {
    this.getContexts()[0].translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.getContexts()[0].rotate(this.transform.rotation)

    this.getContexts()[0].beginPath()
    this.getContexts()[0].drawImage(
      this.image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )
    this.getContexts()[0].closePath()

    this.getContexts()[0].rotate(-this.transform.rotation)
    this.getContexts()[0].translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  /**
   * Generates a new asteroid from the current asteroid according to
   * the given amount.
   *
   * @param amount The amount of fragments to be generated.
   */
  private generateAsteroidFragments(amount: number): void {
    for (let i = 0; i < amount; i++) {
      const rotation = Math.random() * 2 * Math.PI
      const direction = new Vector2(Math.sin(rotation), Math.cos(rotation))

      const position = new Vector2(
        this.transform.position.x,
        this.transform.position.y,
      )

      const velocity = Vector2.multiply(
        direction.normalized,
        0.1 *
          Math.floor(Math.random() * (5 - this._asteroidSize - 2) + 2) *
          -0.7,
      )

      this.gameService.asteroidsAmount += 1

      const fragment = this.instantiate({
        use: {
          asteroidSize: this._asteroidSize - 1,
          isFragment: true,
        },
        entity: Asteroid,
        components: [
          {
            id: '__asteroid_transform__',
            use: {
              rotation,
              position,
            },
          },
          {
            id: '__asteroid_rigidbody__',
            use: {
              velocity,
              mass: 15 * this._asteroidSize,
              maxAngularVelocity: 0.005,
              angularVelocity: 0.005 / this._asteroidSize,
            },
          },
          {
            id: '__asteroid_health__',
            use: {
              color: '#8d8d8d',
              maxHealth: this._asteroidSize * 20,
              health: this._asteroidSize * 20,
            },
          },
        ],
      })

      this.socketService.emit('instantiate', {
        id: fragment.id,
        type: Asteroid.name,
        data: {
          asteroidSize: fragment._asteroidSize,
          image: fragment.image.src,
          rotation,
          position,
          velocity,
          mass: 15 * this._asteroidSize,
          maxAngularVelocity: 0.005,
          angularVelocity: 0.005 / this._asteroidSize,
          isFragment: true,
          color: '#8d8d8d',
          maxHealth: this._asteroidSize * 20,
          health: this._asteroidSize * 20,
        },
      })
    }
  }
}
