import { Type } from '../interfaces/type.interface'
import { Component } from './component'
import { Game } from './game'

/**
 * Class that represents some object in the game
 */
export abstract class Entity {
  public constructor(
    public readonly game: Game,
    public components: Component[] = [],
  ) {}

  /**
   * Method that can create new entities
   *
   * @param entity defines the new entity type
   * @param components defines the new entity component dependencies
   * @returns the created entity
   */
  public instantiate<E extends Entity, C extends Component>(
    entity: Type<E>,
    components?: C[] | Type<C>[],
  ): E {
    return this.game.instantiate(entity, components)
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
}
