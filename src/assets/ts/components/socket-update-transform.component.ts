import { socket } from '../socket'

import { AbstractComponent } from '../engine/abstract-component'
import { Component } from '../engine/decorators/component.decorator'
import { RequireComponents } from '../engine/decorators/require-components.decorator'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { Transform } from './transform.component'

/**
 * Class that represents the component that update the entities into the slave
 * screens according to their position in the master
 */
@Component()
@RequireComponents([Transform])
export class SocketUpdateTransform
  extends AbstractComponent
  implements IOnAwake, IOnStart, IOnLoop
{
  private transform: Transform

  onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  onStart(): void {
    if (this.game.getScreen().number !== 1) {
      socket.on('update-slave', (response) => {
        this.updateSlave(response)
      })
    }
  }

  onLoop(): void {
    if (this.game.getScreen().number !== 1) {
      return
    }

    const { position, dimensions, rotation } = this.transform
    socket.emit('update-slaves', this.game.getScreen().number, {
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
