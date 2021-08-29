import { SocketUpdateTransform } from '../components/socket-update-transform.component'

import spaceshipImg from '../../svg/spaceship.svg'
import { Input } from '../components/input.component'
import { RenderOverflow } from '../components/render-overflow.component'
import { Render } from '../components/render.component'
import { Rigidbody } from '../components/rigidbody.component'
import { Transform } from '../components/transform.component'
import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'
import { IOnDraw } from '../engine/interfaces/on-draw.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'
import { Rect } from '../engine/math/rect'
import { Vector2 } from '../engine/math/vector2'
import { ISpaceship } from '../interfaces/spaceship.interface'
import { Bullet } from './bullet.entity'

/**
 * Class that represents the spaceship entity controlled by the user.
 */
@Entity({
  components: [
    Input,
    Transform,
    Rigidbody,
    RenderOverflow,
    SocketUpdateTransform,
  ],
})
export class Spaceship
  extends AbstractEntity
  implements ISpaceship, IOnAwake, IOnStart, IOnDraw
{
  /**
   * Property that contains the spaceship position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property that contains the spaceship physics.
   */
  private rigidbody: Rigidbody

  public readonly force = 3

  public readonly angularForce = 0.03

  public readonly bulletVelocity = 10

  public isShooting = false

  public lastShot: Date

  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  public onAwake(): void {
    this.transform = this.getComponent(Transform)
    this.rigidbody = this.getComponent(Rigidbody)
  }

  public onStart(): void {
    this.transform.dimensions = new Rect(50, 50)
    this.rigidbody.friction = 0.005
    this.rigidbody.mass = 10
    this.rigidbody.maxAngularVelocity = 0.09
  }

  public onDraw(): void {
    this.drawTriangle()
  }

  private drawTriangle(): void {
    this.game
      .getContext()
      .translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    this.game.getContext().rotate(this.transform.rotation)
    const image = new Image()
    image.src = spaceshipImg

    // TODO: apply color to SVG
    this.game
      .getContext()
      .drawImage(
        image,
        0 - this.transform.dimensions.width / 2,
        0 - this.transform.dimensions.height / 2,
        this.transform.dimensions.width,
        this.transform.dimensions.height,
      )

    this.game.getContext().rotate(-this.transform.rotation)
    this.game
      .getContext()
      .translate(
        -this.transform.canvasPosition.x,
        -this.transform.canvasPosition.y,
      )
  }

  public shoot(): void {
    if (this.lastShot && new Date().getTime() - this.lastShot.getTime() < 300) {
      return
    }

    this.lastShot = new Date()

    const bulletLeft = this.instantiate({
      entity: Bullet,
      components: [Transform, Rigidbody, Render],
    })

    bulletLeft.transform.position = Vector2.sum(
      this.transform.position,
      Vector2.multiply(
        new Vector2(
          Math.sin(this.transform.rotation - (2 * Math.PI) / 4),
          Math.cos(this.transform.rotation - (2 * Math.PI) / 4),
        ),
        24,
      ),
    )
    bulletLeft.transform.rotation = this.transform.rotation
    bulletLeft.rigidbody.velocity = Vector2.sum(
      this.rigidbody.velocity,
      Vector2.multiply(this.direction, this.bulletVelocity),
    )

    const bulletRight = this.instantiate({
      entity: Bullet,
      components: [Transform, Rigidbody, Render],
    })

    bulletRight.transform.position = Vector2.sum(
      this.transform.position,
      Vector2.multiply(
        new Vector2(
          Math.sin(this.transform.rotation + (2 * Math.PI) / 4),
          Math.cos(this.transform.rotation + (2 * Math.PI) / 4),
        ),
        22,
      ),
    )
    bulletRight.transform.rotation = this.transform.rotation
    bulletRight.rigidbody.velocity = Vector2.sum(
      this.rigidbody.velocity,
      Vector2.multiply(this.direction, this.bulletVelocity),
    )
  }
}
