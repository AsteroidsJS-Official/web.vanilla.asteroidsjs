import { socket } from '../socket'

import { AbstractComponent } from '../engine/abstract-component'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { ISpaceship } from '../interfaces/spaceship.interface'
import { Rigidbody } from './rigidbody.component'
import { Transform } from './transform.component'

/**
 * Class that represents the component that update the entities into the slave
 * screens according to their position in the master
 */
export class SocketUpdateTransform
  extends AbstractComponent
  implements IOnAwake, IOnStart, IOnLoop
{
  private screenNumber: number
  private transform: Transform
  private rigidbody: Rigidbody

  onAwake(): void {
    this.screenNumber = this.game.getScreen().number
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  onStart(): void {
    if (this.screenNumber !== 1) {
      socket.on('update-slave', (response) => {
        this.updateSlave(response)
      })
    }
  }

  onLoop(): void {
    if (this.screenNumber !== 1) {
      return
    }

    const { position, dimensions, rotation } = this.transform
    const { isShooting } = this.entity as unknown as ISpaceship
    socket.emit(
      'update-slaves',
      this.screenNumber,
      {
        position,
        dimensions,
        rotation,
      },
      isShooting,
      this.rigidbody.velocity,
    )
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
   *   isShooting: false
   * }
   */
  updateSlave(data: {
    position: { x: number; y: number }
    dimensions: { width: number; height: number }
    rotation: number
    isShooting: boolean
    velocity: Vector2
  }): void {
    this.transform.position = new Vector2(data.position.x, data.position.y)
    this.transform.dimensions = new Rect(
      data.dimensions.width,
      data.dimensions.height,
    )
    this.transform.rotation = data.rotation

    const spaceship = this.entity as unknown as ISpaceship
    ;(spaceship as any).velocity = data.velocity
    spaceship.isShooting = data.isShooting
  }
}
