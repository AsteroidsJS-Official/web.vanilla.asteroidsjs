import { AbstractComponent, Component, IOnLoop, IOnStart } from '@asteroidsjs'

import { Drawer } from './drawer.component'

/**
 * Class that represents the component responsible for rendering the
 * entity
 */
@Component({
  required: [Drawer],
})
export class Render extends AbstractComponent implements IOnStart, IOnLoop {
  public drawer: Drawer

  public onStart(): void {
    this.drawer = this.getComponent(Drawer)
  }

  public onLoop(): void {
    this.drawer.draw()
  }
}
