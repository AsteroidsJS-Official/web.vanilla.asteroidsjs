import { IScreen } from '../../../interfaces/screen.interface'
import { Component } from '../component'
import { Entity } from '../entity'
import { IInstantiateOptions } from './instantiate-options.interface'
import { Type } from './type.interface'

export interface IAsteroidsApplication {
  start(): void

  getContext(): CanvasRenderingContext2D

  getScreen(): IScreen

  instantiate<E extends Entity>(
    options?: IInstantiateOptions<E>,
  ): E extends Entity ? E : Entity

  find<C extends Component>(component: Type<C>): C[]

  destroy<T extends Entity | Component>(instance: T): void
}
