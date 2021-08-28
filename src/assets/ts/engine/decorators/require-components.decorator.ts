import { Component } from '../component'
import { REQUIRE_COMPONENTS } from '../constants'
import { Type } from '../interfaces/type.interface'

export function RequireComponents(
  components: Type<Component>[],
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(REQUIRE_COMPONENTS, components, target)
  }
}
