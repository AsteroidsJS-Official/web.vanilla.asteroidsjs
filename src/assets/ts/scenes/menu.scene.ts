import { Scene, AbstractScene, IOnStart, getHtml } from '@asteroidsjs'

import { Background } from '../entities/background.entity'
import { ManagerAsteroids } from '../entities/master/manager-asteroids.entity'

import { loadMenu } from '../menu'
import { Single } from './single.scene'

@Scene()
export class Menu extends AbstractScene implements IOnStart {
  onStart(): void {
    this.createCanvas()
    this.instantiate({ entity: Background })
    this.instantiate({ entity: ManagerAsteroids, use: { isMenu: true } })
    this.insertMenuHtml()
  }

  async insertMenuHtml(): Promise<void> {
    const html = await getHtml('menu', 'ast-menu')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'
    document.body.appendChild(html)

    loadMenu()
    this.listenButtons()
  }

  private listenButtons(): void {
    const playSPButton = document.getElementById('play-singleplayer-button')
    // const playLMP = document.getElementById('play-local-multiplayer-button')
    // const playOMP = document.getElementById('play-online-multiplayer-button')

    if (playSPButton) {
      playSPButton.addEventListener('click', async () => {
        await this.unload(this)
        document.getElementsByTagName('ast-menu')[0]?.remove()

        this.load(Single)
      })
    }
  }
}
