import { RenderOverflow } from '../components/render-overflow.component'
import { Transform } from '../components/transform.component'
import { AbstractEntity } from '../engine/abstract-entity'
import { Entity } from '../engine/decorators/entity.decorator'
import { Vector2 } from '../engine/math/vector2'

@Entity({
  components: [Transform],
})
export class Child extends AbstractEntity {
  private transform: Transform
  private context: CanvasRenderingContext2D

  onStart(): void {
    this.context = this.game.getContext()
    this.transform = this.getComponent(Transform)
    this.transform.localPosition = new Vector2(50, 50)
  }

  onDraw(): void {
    this.context.translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )
    this.context.rotate(this.transform.rotation)

    this.context.shadowColor = 'yellow'
    this.context.shadowBlur = 25

    this.context.beginPath()

    this.context.fillStyle = '#ffc887'
    this.context.arc(0, 0, this.transform.dimensions.width / 2, 0, 360)
    this.context.fill()
    this.context.closePath()

    this.context.shadowColor = 'transparent'
    this.context.shadowBlur = 0

    this.context.rotate(-this.transform.rotation)
    this.context.translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }
}
