import {
  AbstractEntity,
  Entity,
  getHtml,
  IOnAwake,
  IOnStart,
} from '@asteroidsjs'

import { LGSocketService } from '../../../shared/services/lg-socket.service'
import { SocketService } from '../../../shared/services/socket.service'

import { loadMenu } from '../../../menu'
import { Single } from '../../../scenes/single.scene'

@Entity({
  services: [LGSocketService, SocketService],
})
export class Menu extends AbstractEntity implements IOnAwake, IOnStart {
  private lgSocketService: LGSocketService

  private socketService: SocketService

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
    this.socketService = this.getService(SocketService)
  }

  onStart(): void {
    if (this.lgSocketService.screen?.number === 1) {
      this.insertMenuHtml()
    } else {
      this.socketService.on<string>('change-scene').subscribe((scene) => {
        if (scene === 'single') {
          this.loadSinglePlayer()
        }
      })
    }

    this.lgSocketService.setCanvasSize()

    this.getContexts()[0].canvas.width =
      this.lgSocketService.canvasTotalWidth || window.innerWidth

    this.getContexts()[0].canvas.height =
      this.lgSocketService.canvasTotalHeight || window.innerHeight

    this.getContexts()[0].canvas.style.transform = `translateX(${-this
      .lgSocketService.displacement}px)`
  }

  /**
   * Inserts the menu HTML into the body.
   */
  async insertMenuHtml(): Promise<void> {
    document.getElementsByTagName('ast-menu')[0]?.remove()

    const html = await getHtml('menu', 'ast-menu')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'
    document.body.appendChild(html)

    loadMenu()

    const playSPButton = document.getElementById('play-singleplayer-button')
    // const playLMP = document.getElementById('play-local-multiplayer-button')
    // const playOMP = document.getElementById('play-online-multiplayer-button')

    if (playSPButton) {
      playSPButton.addEventListener('click', () => {
        this.lgSocketService.changeScene('single')
        this.loadSinglePlayer()
      })
    }
  }

  private loadSinglePlayer(): void {
    this.scene.unload(this.scene)
    document.getElementsByTagName('ast-menu')[0]?.remove()

    this.scene.load(Single)
  }
}
