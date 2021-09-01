import { AbstractComponent } from '../engine/abstract-component'
import { Component } from '../engine/decorators/component.decorator'
import { Transform } from './transform.component'

import { IDraw } from '../engine/interfaces/draw.interface'
import { IOnAwake } from '../engine/interfaces/on-awake.interface'

import { hasDraw } from '../engine/utils/validations'

@Component({
  required: [Transform],
})
export class Drawer extends AbstractComponent implements IOnAwake, IDraw {
  private transform: Transform

  onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  draw(): void {
    ;[...this.transform.children.map((t) => t.entity), this.entity]
      .filter((instance) => hasDraw(instance))
      .forEach((instance) => (instance as any).draw())
  }
}
