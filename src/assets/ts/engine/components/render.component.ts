import { hasDraw } from '../utils/validations'

import { Component } from '../core/component'
import { IDraw } from '../interfaces/draw.interface'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'

/**
 * Class that represents the component responsible for rendering the
 * entity
 */
export class Render extends Component implements IStart, ILoop {
  public drawer: IDraw

  public start(): void {
    if (!hasDraw(this.entity)) {
      throw new Error(
        `${this.entity.constructor.name} has a ${this.constructor.name} but not implements the IDraw interface`,
      )
    }

    this.drawer = this.entity
  }

  public loop(): void {
    this.drawer?.draw()
  }
}
