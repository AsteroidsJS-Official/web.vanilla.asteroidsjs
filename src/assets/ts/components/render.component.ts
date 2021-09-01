import { AbstractComponent } from '../engine/abstract-component'
import { Component } from '../engine/decorators/component.decorator'
import { Drawer } from './drawer.component'

import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'

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
