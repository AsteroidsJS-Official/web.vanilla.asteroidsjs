import { AbstractEntity, Entity, IDraw } from '@asteroidsjs'

import { Drawer } from '../../../shared/components/drawer.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Transform } from '../../../shared/components/transform.component'

@Entity({
  components: [Drawer, Transform, Render],
})
export class Background extends AbstractEntity implements IDraw {
  draw(): void {
    this.getContexts()[0].fillStyle = '#0d0d0d'
    this.getContexts()[0].fillRect(
      0,
      0,
      this.getContexts()[0].canvas.width,
      this.getContexts()[0].canvas.height,
    )
  }
}
