import {
  AbstractEntity,
  Entity,
  getHtml,
  IOnAwake,
  IOnStart,
} from '@asteroidsjs'

import { LGSocketService } from '../services/lg-socket.service'

import { loadMenu } from '../menu'
import { Single } from '../scenes/single.scene'

@Entity({
  services: [LGSocketService],
})
export class Menu extends AbstractEntity implements IOnAwake, IOnStart {
  private lgSocketService: LGSocketService

  onAwake(): void {
    this.lgSocketService = this.getService(LGSocketService)
  }

  onStart(): void {
    if (this.lgSocketService.screen?.number === 1) {
      this.insertMenuHtml()
    } else {
      this.lgSocketService.on<string>('change-scene').subscribe((scene) => {
        if (scene === 'single') {
          this.loadSinglePlayer()
        }
      })
    }

    this.lgSocketService.setCanvasSize()

    this.scene.getContext().canvas.width =
      this.lgSocketService.canvasTotalWidth || window.innerWidth

    this.scene.getContext().canvas.height =
      this.lgSocketService.canvasTotalHeight || window.innerHeight

    this.scene.getContext().canvas.style.transform = `translateX(${-this
      .lgSocketService.displacement}px)`
  }

  /**
   * Inserts the menu HTML into the body.
   */
  async insertMenuHtml(): Promise<void> {
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
      playSPButton.addEventListener('click', async () => {
        this.lgSocketService.emit('change-scene', 'single')
        this.loadSinglePlayer()
      })
    }
  }

  private async loadSinglePlayer(): Promise<void> {
    await this.scene.unload(this.scene)
    document.getElementsByTagName('ast-menu')[0]?.remove()

    this.scene.load(Single)
  }
}
