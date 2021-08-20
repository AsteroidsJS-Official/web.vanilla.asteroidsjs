import { GameFactory } from '../game.factory'
import { Type } from '../interfaces/type.interface'
import { Component } from './component'

/**
 * Class that represents some object in the game
 */
export abstract class Entity {
  public constructor(public components: Component[]) {}

  public instantiate<T extends Component, C extends Entity>(
    entity: Type<C>,
    components?: T[] | Type<T>[],
  ): C {
    return GameFactory.register(entity, components)
  }

  /**
   * Method that returns some child component, attached to this entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * this entity
   */
  public getComponent<T extends Component>(component: Type<T>): T {
    return this.components.find(
      (c) => c.constructor.name === component.name,
    ) as T
  }

  /**
   * Method that creates a new entity based on the passed entity type and on
   * the passed component types
   *
   * @param entity defines the new entity type
   * @param components defines an array of component types
   * @returns an object that represents the created entity
   */
  public static instantiate<T extends Component, C extends Entity>(
    entity: Type<C>,
    components?: T[] | Type<T>[],
  ): Entity {
    const instance = new entity()
    instance.components = components.map((component) => {
      if (!(component instanceof Component)) {
        component = new component(instance)
      }
      return component
    })
    return instance
  }
}
