import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnStart,
  ISocketData,
  Vector2,
} from '@asteroidsjs'

import { socket } from '../socket'

import { Drawer } from '../components/drawer.component'
import { RenderOverflow } from '../components/render-overflow.component'
import { Transform } from '../components/transform.component'

import spaceshipImg from '../../svg/spaceship-blue.svg'

/**
 * Class that represents the virtual spaceship entity, used for rendering
 * uncontrollable spaceships.
 */
@Entity({
  components: [Drawer, Transform, RenderOverflow],
})
export class SpaceshipVirtual
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw
{
  /**
   * Property that contains the spaceship position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property that contains the spaceship velocity.
   */
  private velocity: Vector2

  /**
   * Property responsible for the spaceship bullet velocity.
   */
  public readonly bulletVelocity = 10

  /**
   * Property responsible for the spaceship last bullet time.
   */
  public lastShot: Date

  /**
   * Property that indicates the direction that the spaceship is facing.
   */
  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  public isShooting = false

  onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  onStart(): void {
    socket.on('update-screen', ({ id, data }: ISocketData) => {
      if (this.id !== id) {
        return
      }
      this.transform.position = data.position
      this.transform.dimensions = data.dimensions
      this.transform.rotation = data.rotation
    })
  }

  public draw(): void {
    this.drawTriangle()
  }

  private drawTriangle(): void {
    this.getContext().translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.getContext().rotate(this.transform.rotation)

    const image = new Image()
    image.src = spaceshipImg

    // TODO: apply color to SVG
    this.getContext().drawImage(
      image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )

    this.getContext().rotate(-this.transform.rotation)
    this.getContext().translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
