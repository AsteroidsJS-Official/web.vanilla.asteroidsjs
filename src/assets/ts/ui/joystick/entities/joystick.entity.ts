import {
  AbstractEntity,
  appendChildren,
  Entity,
  getElement,
  getHtml,
  IOnAwake,
  IOnStart,
} from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import nipplejs, { JoystickManager } from 'nipplejs'

@Entity({
  services: [SocketService],
})
export class Joystick extends AbstractEntity implements IOnAwake, IOnStart {
  private socketService: SocketService

  private joystickManager: JoystickManager

  onAwake(): void {
    this.socketService = this.getService(SocketService)
  }

  onStart(): void {
    this.insertJoystickHtml()
  }

  private async insertJoystickHtml(): Promise<void> {
    const html = await getHtml('joystick', 'ast-joystick')
    html.style.position = 'absolute'
    html.style.top = '0'
    html.style.left = '0'

    appendChildren(document.body, html)

    this.configureJoystick()
  }

  private configureJoystick(): void {
    const zone = getElement('.analog-region')

    if (!zone) {
      return
    }

    this.joystickManager = nipplejs.create({
      color: '#48bdff',
      lockX: true,
      restOpacity: 0.8,
      catchDistance: 300,
      position: {
        bottom: '150px',
        left: '150px',
      },
      mode: 'static',
      zone,
    })
  }
}
