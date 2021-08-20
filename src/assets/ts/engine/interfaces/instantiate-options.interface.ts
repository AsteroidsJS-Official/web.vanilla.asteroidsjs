import { Component } from '../core/component'
import { Entity } from '../core/entity'
import { Type } from './type.interface'

export interface IInstantiateOptions<E extends Entity> {
  entity?: Type<E>
  components?: Type<Component>[]
}
