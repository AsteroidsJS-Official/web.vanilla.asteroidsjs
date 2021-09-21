import {
  AbstractEntity,
  Entity,
  IDraw,
  IOnAwake,
  IOnStart,
  ISocketData,
  Vector2,
} from '@asteroidsjs'

import { SocketService } from '../../../shared/services/socket.service'

import { Drawer } from '../../../shared/components/drawer.component'
import { Health } from '../../../shared/components/health.component'
import { RenderOverflow } from '../../../shared/components/renderers/render-overflow.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Transform } from '../../../shared/components/transform.component'

/**
 * Class that represents the virtual spaceship entity, used for rendering
 * uncontrollable spaceships.
 */
@Entity({
  services: [SocketService],
  components: [
    Drawer,
    Transform,
    RenderOverflow,
    { id: '__spaceship_virtual_health__', class: Health },
  ],
})
export class SpaceshipVirtual
  extends AbstractEntity
  implements IOnAwake, IOnStart, IDraw
{
  private socketService: SocketService

  /**
   * Property that contains the spaceship position, dimensions and rotation.
   */
  private transform: Transform

  /**
   * Property responsible for the spaceship last bullet time.
   */
  public lastShot: Date

  private health: Health

  private image: HTMLImageElement

  public imageSrc = ''

  public nickname = ''

  public spaceshipColor = ''

  /**
   * Property that indicates the direction that the spaceship is facing.
   */
  public get direction(): Vector2 {
    return new Vector2(
      Math.sin(this.transform.rotation),
      Math.cos(this.transform.rotation),
    )
  }

  onAwake(): void {
    this.socketService = this.getService(SocketService)
    this.transform = this.getComponent(Transform)
    this.health = this.getComponent(Health)
  }

  onStart(): void {
    if (this.getComponent(Render) || this.getComponent(RenderOverflow)) {
      this.image = new Image()
      this.image.src = this.imageSrc
    }

    this.health.color = this.spaceshipColor

    this.socketService
      .on<ISocketData>('update-screen')
      .subscribe(({ id, data }) => {
        if (this.id !== id) {
          return
        }
        this.transform.position = data.position
        this.transform.dimensions = data.dimensions
        this.transform.rotation = data.rotation
        this.health.health = data.health
        this.health.maxHealth = data.maxHealth
      })

    this.socketService.on<string>('destroy').subscribe((id: string) => {
      if (id === this.id) {
        this.destroy(this)
      }
    })
  }

  public draw(): void {
    this.drawTriangle()
  }

  private drawTriangle(): void {
    this.getContexts()[0].translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )

    // this.getContext().fillStyle = this.spaceshipColor
    // this.getContext().textAlign = 'center'
    // this.getContext().canvas.style.letterSpacing = '0.75px'
    // this.getContext().font = '12px Neptunus'
    // this.getContext().fillText(
    //   this.nickname,
    //   0,
    //   0 - (this.transform.dimensions.height / 2 + 20),
    // )

    this.getContexts()[0].rotate(this.transform.rotation)

    this.getContexts()[0].drawImage(
      this.image,
      0 - this.transform.dimensions.width / 2,
      0 - this.transform.dimensions.height / 2,
      this.transform.dimensions.width,
      this.transform.dimensions.height,
    )

    this.getContexts()[0].rotate(-this.transform.rotation)
    this.getContexts()[0].translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
