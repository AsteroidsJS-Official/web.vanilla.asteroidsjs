import { Transform } from '../components/transform.component'
import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'

@Entity({
  components: [Transform],
})
export class Child extends AbstractEntity implements IOnStart, IDraw {
  private transform: Transform
  private context: CanvasRenderingContext2D

  onStart(): void {
    this.context = this.game.getContext()
    this.transform = this.getComponent(Transform)
  }

  draw(): void {
    if (this.transform.parent) {
      this.context.translate(
        this.transform.parent.canvasPosition.x,
        this.transform.parent.canvasPosition.y,
      )
    } else {
      this.context.translate(
        this.transform.canvasPosition.x,
        this.transform.canvasPosition.y,
      )
    }
    this.context.rotate(this.transform.rotation)

    this.context.shadowColor = 'yellow'
    this.context.shadowBlur = 25

    this.context.beginPath()

    this.context.fillStyle = '#ffc887'
    this.context.arc(
      this.transform.localPosition.x,
      -this.transform.localPosition.y,
      this.transform.dimensions.width / 2,
      0,
      360,
    )
    this.context.fill()
    this.context.closePath()

    this.context.shadowColor = 'transparent'
    this.context.shadowBlur = 0

    this.context.rotate(-this.transform.rotation)

    if (this.transform.parent) {
      this.context.translate(
        -this.transform.parent.canvasPosition.x,
        -this.transform.parent.canvasPosition.y,
      )
    } else {
      this.context.translate(
        -this.transform.canvasPosition.x,
        -this.transform.canvasPosition.y,
      )
    }
  }
}
