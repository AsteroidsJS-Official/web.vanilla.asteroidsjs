import { AbstractComponent, Component, IOnStart } from '@asteroidsjs'

import { Drawer } from '../drawer.component'

import { IOnRender } from '@asteroidsjs/src/interfaces/on-render.interface'

/**
 * Class that represents the component responsible for rendering the
 * entity
 */
@Component({
  required: [Drawer],
})
export class Render extends AbstractComponent implements IOnStart, IOnRender {
  public drawer: Drawer

  public onStart(): void {
    this.drawer = this.getComponent(Drawer)
  }

  public onRender(): void {
    this.drawer.draw()
  }
}
