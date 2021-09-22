import { AbstractService } from '../abstract-service'

import { AbstractComponent } from '../abstract-component'

import { Type } from './type.interface'

export interface IComponentOptions {
  services?: Type<AbstractService>[]
  required?: Type<AbstractComponent>[]
  order?: number
}
