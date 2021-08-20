import { Component } from '../core/component'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
import { Image } from './image.component'

export class Render extends Component implements IStart, ILoop {
  private image: Image

  public start(): void {
    this.requires([Image])

    this.image = this.getComponent(Image)
  }

  public loop(): void {
    this.image.draw()
  }
}
