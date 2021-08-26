import { socket } from '../../socket'

import { Component } from '../core/component'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Rect } from '../math/rect'
import { Vector2 } from '../math/vector2'
import { Transform } from './transform.component'

/**
 * Class that represents the component that update the entities into the slave
 * screens according to their position in the master
 */
export class SocketUpdateTransform extends Component implements IStart, ILoop {
  private transform: Transform

  start(): void {
    this.transform = this.getComponent(Transform)

    if (this.game.screenNumber !== 1) {
      socket.on('update-slave', (response) => {
        this.updateSlave(response)
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

  /**
   * Updates the current slave screen based on the master screen entity.
   *
   * @param data An object containing the master entity's position, dimensions and rotation.
   *
   * @example
   * {
   *   position: { x: 67, y: -450 },
   *   dimensions: { width: 40, height: 50 },
   *   rotation: 40,
   * }
   */
  updateSlave(data: {
    position: { x: number; y: number }
    dimensions: { width: number; height: number }
    rotation: number
  }): void {
    this.transform.position = new Vector2(data.position.x, data.position.y)
    this.transform.dimensions = new Rect(
      data.dimensions.width,
      data.dimensions.height,
    )
    this.transform.rotation = data.rotation
  }
}
