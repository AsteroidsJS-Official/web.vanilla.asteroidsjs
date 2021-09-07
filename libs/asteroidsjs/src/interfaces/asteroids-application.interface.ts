import { AbstractEntity } from '../abstract-entity'

import { AbstractService } from '../abstract-service'

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

  addService<E extends AbstractEntity, P extends AbstractService>(
    entity: E,
    service: Type<P>,
  ): P

  addComponent<E extends AbstractEntity, C extends AbstractComponent>(
    entity: E,
    component: Type<C>,
  ): C
}