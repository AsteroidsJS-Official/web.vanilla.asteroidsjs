import {
  AbstractEntity,
  addClass,
  appendChildren,
  createElement,
  destroyMultipleElements,
  Entity,
  getElement,
  getHtml,
  getMultipleElements,
  IOnAwake,
  IOnDestroy,
  IOnStart,
  removeClass,
} from '@asteroidsjs'

import { LGSocketService } from '../../../shared/services/lg-socket.service'
import { SocketService } from '../../../shared/services/socket.service'

import { GameService } from '../../../shared/services/game.service'
import { MultiplayerService } from '../../../shared/services/multiplayer.service'
import { UserService } from '../../../shared/services/user.service'

import { AudioSource } from '../../../shared/components/audio-source.component'
import { Transform } from '../../../shared/components/transform.component'

import { IPlayerVisual } from '../../../shared/interfaces/player.interface'

import { isMobile } from './../../../utils/platform'

import { Joystick } from '../../../scenes/joystick.scene'
import { LocalMP } from '../../../scenes/local-mp.scene'
import { Single } from '../../../scenes/single.scene'
import { Subscription } from 'rxjs'

@Entity({
  services: [
    GameService,
    LGSocketService,
    MultiplayerService,
    SocketService,
    UserService,
  ],
  components: [
    {
      class: AudioSource,
      use: {
        spatial: true,
        loop: true,
        volume: 0.7,
      },
    },
    Transform,
  ],
})
export class Menu
  extends AbstractEntity
  implements IOnAwake, IOnStart, IOnDestroy
{
  private gameService: GameService

  private lgSocketService: LGSocketService

  private socketService: SocketService

  private multiplayerService: MultiplayerService

  private userService: UserService

  private constrollerStatusSub: Subscription

  private sceneSubscription: Subscription

  /**
   * Property that contains the menu sound effects.
   */
  private audioSource: AudioSource

  onAwake(): void {
    this.gameService = this.getService(GameService)
    this.lgSocketService = this.getService(LGSocketService)
    this.multiplayerService = this.getService(MultiplayerService)
    this.socketService = this.getService(SocketService)
    this.userService = this.getService(UserService)

    this.audioSource = this.getComponent(AudioSource)
  }

  onStart(): void {
    if (!isMobile) {
      this.sceneSubscription = this.socketService
        .on<string>('change-scene')
        .subscribe((scene) => {
          if (scene === 'single') {
            this.loadSinglePlayer()
          } else if (scene === 'local-mp') {
            this.loadLocalMultiplayer()
          }
        })

      this.audioSource.play('./assets/audios/menu-music.mp3')
    }

    if (isMobile) {
      this.constrollerStatusSub = this.socketService
        .emit<unknown, string | null>('master-controller-status')
        .subscribe((masterController) => {
          if (masterController === null) {
            this.socketService.emit(
              'connect-master-controller',
              this.userService.userId,
            )
            this.userService.isMaster = true
          }

          if (
            masterController &&
            !masterController.includes(this.userService.userId)
          ) {
            this.userService.isMaster = false
          }

          if (masterController || masterController === null) {
            this.insertMenuHtml()
          }
        })
    } else if (this.lgSocketService.screen?.number === 1) {
      this.insertMenuHtml()
    } else {
      this.insertSlaveMenuHtml()
    }

    this.lgSocketService.setCanvasSize()

    this.getContexts()[0].canvas.width =
      this.lgSocketService.canvasTotalWidth || window.innerWidth

    this.getContexts()[0].canvas.height =
      this.lgSocketService.canvasTotalHeight || window.innerHeight

    this.getContexts()[0].canvas.style.transform = `translateX(${-this
      .lgSocketService.displacement}px)`
  }

  onDestroy(): void {
    destroyMultipleElements('ast-menu')
    destroyMultipleElements('ast-controller-menu')
    destroyMultipleElements('.overlay')

    this.sceneSubscription?.unsubscribe()
    this.constrollerStatusSub?.unsubscribe()
  }

  /**
   * Loads all the menu components and its visual behavior.
   */
  private loadMenu(): void {
    const inputGuest = getElement<HTMLInputElement>('#nickname-guest-input')

    const loginButton = getElement<HTMLButtonElement>('.login-button')
    const skinButtons = getMultipleElements('.spaceship-skin-picker')

    const spaceshipSkin = getElement<HTMLImageElement>('.spaceship-skin')
    const colorPicker = getElement('.spaceship-color-picker')

    const localNickname = window.localStorage.getItem('asteroidsjs_nickname')
    const localColor = window.localStorage.getItem(
      'asteroidsjs_spaceship_color',
    )

    const colorButtons: HTMLButtonElement[] = []

    if (!(loginButton && spaceshipSkin && inputGuest && colorPicker)) {
      return
    }

    if (localNickname) {
      inputGuest.value = localNickname
    }

    loginButton.addEventListener('click', () => {
      addClass('.modal-container', 'active')
    })

    const spaceshipColors = [
      {
        name: 'grey',
        color: '#888888',
      },
      {
        name: 'red',
        color: '#ff0055',
      },
      {
        name: 'blue',
        color: '#0084ff',
      },
      {
        name: 'orange',
        color: '#ff9c41',
      },
      {
        name: 'green',
        color: '#59c832',
      },
      {
        name: 'purple',
        color: '#d45aff',
      },
    ]

    inputGuest.addEventListener('input', (e: InputEvent) => {
      window.localStorage.setItem(
        'asteroidsjs_nickname',
        (e.target as HTMLInputElement).value,
      )
    })

    skinButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.audioSource.playOneShot('./assets/audios/menu-mouse-click.mp3')
      })
    })

    spaceshipColors.forEach(({ name, color }, index) => {
      const colorButton = createElement<HTMLButtonElement>('button')
      addClass(colorButton, 'color-button', name)

      if (index === 0) {
        addClass(colorButton, 'active')
      }

      colorButton.style.backgroundColor = color
      colorButtons.push(colorButton)

      if (colorPicker) {
        appendChildren(colorPicker, colorButton)
      }

      colorButton.addEventListener('click', () => {
        if (colorButton.classList.contains('active')) {
          return
        }

        this.userService.spaceshipColor = colorButton.style.backgroundColor
        this.userService.spaceshipImage = name

        if (!isMobile || this.userService.isMaster) {
          this.socketService.emit('update-player', {
            nickname: this.userService.nickname,
            color: name,
          })
        }

        removeClass('.color-button.active', 'active')
        addClass(colorButton, 'active')

        window.localStorage.setItem(
          'asteroidsjs_spaceship_color',
          JSON.stringify({
            rgb: colorButton.style.backgroundColor,
            name,
          }),
        )

        spaceshipSkin.src = `./assets/svg/spaceship-${name}.svg`
      })
    })

    if (localColor) {
      const colorName = JSON.parse(localColor).name

      colorButtons.forEach((button) =>
        button.classList.contains(colorName)
          ? addClass(button, 'active')
          : removeClass(button, 'active'),
      )

      spaceshipSkin.src = `./assets/svg/spaceship-${colorName}.svg`
    }

    getMultipleElements('.play-buttons button').forEach((btn) => {
      if (!isMobile) {
        btn.addEventListener('mouseenter', () => {
          this.audioSource.playOneShot('./assets/audios/menu-mouse-hover.mp3')
        })
      }

      btn.addEventListener('click', () => {
        this.audioSource.playOneShot('./assets/audios/menu-mouse-click.mp3')
      })
    })
  }

  /**
   * Inserts the menu HTML into the body.
   */
  private async insertMenuHtml(): Promise<void> {
    destroyMultipleElements(isMobile ? 'ast-controller-menu' : 'ast-menu')

    const html = await (isMobile
      ? getHtml('controller-menu', 'ast-controller-menu')
      : getHtml('menu', 'ast-menu'))

    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'
    appendChildren(document.body, html)

    this.loadMenu()

    const playSPButton = getElement<HTMLButtonElement>(
      '.play-singleplayer-button',
    )
    const playLMPButton = getElement<HTMLButtonElement>(
      '.play-local-multiplayer-button',
    )
    // const playOMP = getElement('.play-online-multiplayer-button')

    const playButton = getElement<HTMLButtonElement>('.play-button')
    const backButton = getElement<HTMLButtonElement>('.back-button')

    const colorButtons = getMultipleElements(
      '.color-button',
    ) as HTMLButtonElement[]

    const inputGuest = getElement<HTMLInputElement>('#nickname-guest-input')

    const spaceshipSkin = getElement<HTMLImageElement>('.spaceship-skin')

    if (
      !(
        playSPButton &&
        playLMPButton &&
        inputGuest &&
        spaceshipSkin &&
        (!isMobile || (playButton && backButton))
      )
    ) {
      return
    }

    if (isMobile) {
      playButton.addEventListener('click', () => {
        this.audioSource.playOneShot('./assets/audios/menu-mouse-click.mp3')

        if (!this.userService.isMaster) {
          this.multiplayerService.lobbyStatus.subscribe((isLobbyOpen) => {
            if (isLobbyOpen) {
              this.multiplayerService.connectMe()

              destroyMultipleElements('ast-controller-menu')
              this.scene.unload(this.scene)
              this.scene.load(Joystick)
            }
          })

          return
        }
        addClass('.controller-menu-container', 'hide')
        removeClass('.controller-play-menu-container', 'hide')
      })

      backButton.addEventListener('click', () => {
        this.audioSource.playOneShot('./assets/audios/menu-mouse-click.mp3')

        addClass('.controller-play-menu-container', 'hide')
        removeClass('.controller-menu-container', 'hide')
      })
    }

    playSPButton.addEventListener('click', () => {
      setTimeout(() => {
        this.lgSocketService.changeScene('single')

        if (isMobile) {
          destroyMultipleElements('ast-controller-menu')
          this.scene.unload(this.scene)
          this.scene.load(Joystick)
        }
      }, 400)
    })

    playLMPButton.addEventListener('click', () => {
      setTimeout(() => {
        this.lgSocketService.changeScene('local-mp')

        if (isMobile) {
          this.gameService.isConnectedToRoom = true
          this.multiplayerService.connectMe()
          destroyMultipleElements('ast-controller-menu')
          this.scene.unload(this.scene)
          this.scene.load(Joystick)
        }
      }, 400)
    })

    colorButtons.forEach((button) => {
      if (button.classList.contains('active')) {
        this.userService.spaceshipColor = button.style.backgroundColor
        this.userService.spaceshipImage = button.classList.item(1)
      }
    })

    this.userService.nickname = inputGuest.value

    if (!isMobile || this.userService.isMaster) {
      this.socketService.emit('update-player', {
        nickname: this.userService.nickname,
        color: this.userService.spaceshipImage,
      })
    }

    inputGuest.addEventListener('input', (event: InputEvent) => {
      this.userService.nickname = (event.target as HTMLInputElement).value

      if (!isMobile || this.userService.isMaster) {
        this.socketService.emit('update-player', {
          nickname: this.userService.nickname,
          color: this.userService.spaceshipImage,
        })
      }
    })

    if (isMobile && !this.userService.isMaster) {
      return
    }

    this.socketService
      .on<IPlayerVisual>('update-player')
      .subscribe((player) => {
        this.userService.nickname = player.nickname
        inputGuest.value = player.nickname

        const colorButton = getElement<HTMLButtonElement>(
          '.color-button.' + player.color,
        )

        if (!colorButton) {
          return
        }

        removeClass(
          '.color-button.' + this.userService.spaceshipImage,
          'active',
        )
        addClass(colorButton, 'active')

        this.userService.spaceshipColor = colorButton.style.backgroundColor
        this.userService.spaceshipImage = player.color

        window.localStorage.setItem('asteroidsjs_nickname', player.nickname)

        window.localStorage.setItem(
          'asteroidsjs_spaceship_color',
          JSON.stringify({
            rgb: colorButton.style.backgroundColor,
            name: player.color,
          }),
        )

        const spaceshipSkin = getElement<HTMLImageElement>('.spaceship-skin')

        spaceshipSkin.src = `./assets/svg/spaceship-${player.color}.svg`
      })
  }

  /**
   * Inserts the overlay element into the body.
   */
  private insertSlaveMenuHtml(): void {
    destroyMultipleElements('.overlay')

    const div = createElement('div')
    addClass(div, 'overlay')

    appendChildren(document.body, div)
  }

  /**
   * Unloads the current scene and loads the single player scene.
   */
  private loadSinglePlayer(): void {
    this.scene.unload(this.scene)
    this.scene.load(Single)
  }

  /**
   * Unloads the current scene and loads the local mp player scene.
   */
  private loadLocalMultiplayer(): void {
    this.scene.unload(this.scene)
    this.scene.load(LocalMP)
  }
}
