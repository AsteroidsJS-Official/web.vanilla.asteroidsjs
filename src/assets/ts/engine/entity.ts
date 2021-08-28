import { Component } from './component'
import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'
import { Type } from './interfaces/type.interface'
import { Provider } from './provider'

/**
 * Class that represents some object in the game
 */
export class Entity {
  public constructor(
    public readonly game: IAsteroidsApplication,
    public components: Component[] = [],
    public providers: Provider[] = [],
  ) {}

  /**
   * Method that can create new entities
   *
   * @param entity defines the new entity type
   * @param components defines the new entity component dependencies
   * @returns the created entity
   */
  public instantiate<E extends Entity>(
    options?: IInstantiateOptions<E>,
  ): E extends Entity ? E : Entity {
    return this.game.instantiate(options)
  }

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * the same parent entity
   */
  public getProvider<T extends Provider>(component: Type<T>): T {
    return this.providers.find(
      (c) => c.constructor.name === component.name,
    ) as T
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
   * Method that detroyes some entity
   *
   * @param instance defines the instance that will be destroyed
   */
  public destroy<T extends Entity | Component>(instance: T): void {
    this.game.destroy(instance)
  }

  /**
   * Method that returns some child component, attached to some entity
   *
   * @param component defines the component type
   * @returns an array of objects with the passed type
   */
  public find<C extends Component>(component: Type<C>): C[] {
    return this.game.find(component)
  }
}
