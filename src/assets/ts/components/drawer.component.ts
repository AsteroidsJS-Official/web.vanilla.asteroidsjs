import { AbstractComponent, Component, IDraw, IOnAwake } from '@asteroidsjs'

import { Transform } from './transform.component'

import { hasDraw } from '../../../../libs/asteroidsjs/src/utils/validations'

@Component({
  required: [Transform],
})
export class Drawer extends AbstractComponent implements IOnAwake, IDraw {
  private transform: Transform

  onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  draw(): void {
    const entities = [
      this.entity,
      ...this.transform.children.map((t) => t.entity),
    ]
    const components = entities
      .map((e) => e.getAllComponents())
      .flat()
      .filter((c) => c.constructor.name !== Drawer.name)

    ;[...entities, ...components]
      .filter((instance) => hasDraw(instance))
      .forEach((instance) => (instance as any).draw())
  }
}
