import { hasDraw } from '../engine/utils/validations'

import { AbstractComponent } from '../engine/abstract-component'
import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnLoop } from '../engine/interfaces/on-loop.interface'
import { IOnStart } from '../engine/interfaces/on-start.interface'

/**
 * Class that represents the component responsible for rendering the
 * entity
 */
export class Render extends AbstractComponent implements IOnStart, IOnLoop {
  public drawer: IDraw

  public onStart(): void {
    if (!hasDraw(this.entity)) {
      throw new Error(
        `${this.entity.constructor.name} has a ${this.constructor.name} but not implements the IDraw interface`,
      )
    }

    this.drawer = this.entity
  }

  public onLoop(): void {
    this.drawer?.draw()
  }
}
