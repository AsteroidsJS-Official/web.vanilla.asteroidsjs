import { AbstractService } from '../abstract-service'

import { Type } from './type.interface'

export interface IServiceOptions {
  services?: Type<AbstractService>[]
}
