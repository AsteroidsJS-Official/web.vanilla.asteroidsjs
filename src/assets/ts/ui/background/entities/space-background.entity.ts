import { AbstractEntity, Entity, IDraw } from '@asteroidsjs'

import { Drawer } from '../../../shared/components/drawer.component'
import { Render } from '../../../shared/components/renderers/render.component'
import { Transform } from '../../../shared/components/transform.component'

@Entity({
  components: [Drawer, Transform, Render],
})
export class SpaceBackground extends AbstractEntity implements IDraw {
  draw(): void {
    this.getContexts()[1].fillStyle = 'rgb(13, 13, 13, 0.25)'
    this.getContexts()[1].fillRect(
      0,
      0,
      this.getContexts()[1].canvas.width,
      this.getContexts()[1].canvas.height,
    )
  }
}
