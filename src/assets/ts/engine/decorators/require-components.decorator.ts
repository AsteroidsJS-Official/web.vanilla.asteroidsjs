import { AbstractComponent } from '../abstract-component'
import { REQUIRE_COMPONENTS } from '../constants'
import { Type } from '../interfaces/type.interface'

export function RequireComponents(
  components: Type<AbstractComponent>[],
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(REQUIRE_COMPONENTS, components, target)
  }
}
