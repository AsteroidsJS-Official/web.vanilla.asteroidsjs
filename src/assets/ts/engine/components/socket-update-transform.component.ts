import { socket } from '../../socket'

import { Component } from '../core/component'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Rect } from '../math/rect'
import { Vector2 } from '../math/vector2'
import { Transform } from './transform.component'

export class SocketUpdateTransform extends Component implements IStart, ILoop {
  private transform: Transform

  start(): void {
    this.transform = this.getComponent(Transform)

    if (this.game.screenNumber !== 1) {
      socket.on('update-slave', ({ position, dimensions, rotation }) => {
        this.transform.position = new Vector2(position.x, position.y)
        this.transform.dimensions = new Rect(
          dimensions.width,
          dimensions.height,
        )
        this.transform.rotation = rotation
      })
    }
  }

  loop(): void {
    if (this.game.screenNumber !== 1) {
      return
    }

    const { position, dimensions, rotation } = this.transform
    socket.emit('update-slaves', this.game.screenNumber, {
      position,
      dimensions,
      rotation,
    })
  }
}
