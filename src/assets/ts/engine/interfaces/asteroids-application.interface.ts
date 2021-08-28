import { IScreen } from '../../interfaces/screen.interface'
import { AbstractComponent } from '../abstract-component'
import { AbstractEntity } from '../abstract-entity'
import { IInstantiateOptions } from './instantiate-options.interface'
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
}
