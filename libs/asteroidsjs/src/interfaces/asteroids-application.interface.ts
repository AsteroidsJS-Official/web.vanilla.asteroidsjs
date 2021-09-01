import { AbstractEntity } from '../abstract-entity'

import { AbstractProvider } from '../abstract-provider'

import { AbstractComponent } from '../abstract-component'

import { IInstantiateOptions } from './instantiate-options.interface'
import { IScreen } from './screen.interface'
import { Type } from './type.interface'

export interface IAsteroidsApplication {
  start(): void

  getContext(): CanvasRenderingContext2D

  getScreen(): IScreen

  instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity

  find<C extends AbstractComponent>(component: Type<C>): C[]

  destroy<T extends AbstractEntity | AbstractComponent>(instance: T): void

  addProvider<E extends AbstractEntity, P extends AbstractProvider>(
    entity: E,
    provider: Type<P>,
  ): P

  addComponent<E extends AbstractEntity, C extends AbstractComponent>(
    entity: E,
    component: Type<C>,
  ): C
}
