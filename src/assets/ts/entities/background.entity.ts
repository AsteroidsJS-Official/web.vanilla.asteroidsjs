import { AbstractEntity, Entity, IDraw } from '@asteroidsjs'

import { Drawer } from '../components/drawer.component'
import { Render } from '../components/renderers/render.component'
import { Transform } from '../components/transform.component'

@Entity({
  components: [Drawer, Transform, Render],
})
export class Background extends AbstractEntity implements IDraw {
  draw(): void {
    this.getContext().fillStyle = '#0d0d0d'
    this.getContext().fillRect(
      0,
      0,
      this.getContext().canvas.width,
      this.getContext().canvas.height,
    )
  }
}
