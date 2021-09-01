import { AbstractComponent } from './abstract-component'
import { AbstractProvider } from './abstract-provider'
import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'
import { Type } from './interfaces/type.interface'

/**
 * Class that represents some object in the game
 */
export class AbstractEntity {
  /**
   * Property that defines the entity unique id
   */
  public id: number | string

  public constructor(
    public readonly game: IAsteroidsApplication,
    public components: AbstractComponent[] = [],
    public providers: AbstractProvider[] = [],
  ) {}

  /**
   * Method that can create new entities
   *
   * @param entity defines the new entity type
   * @param components defines the new entity component dependencies
   * @returns the created entity
   */
  public instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity {
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
  public getProvider<P extends AbstractProvider>(component: Type<P>): P {
    return this.providers.find(
      (c) => c.constructor.name === component.name,
    ) as P
  }

  /**
   * Method that returns some child component, attached to this entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * this entity
   */
  public getComponent<C extends AbstractComponent>(component: Type<C>): C {
    return this.components.find(
      (c) => c.constructor.name === component.name,
    ) as C
  }

  /**
   * Method that returns several child components, attached to this entity
   *
   * @param component defines the component type
   * @returns an array with objects that represents the component instance, attached to
   * this entity
   */
  public getAllComponents<C extends AbstractComponent>(
    component: Type<C>,
  ): C[] {
    return this.components.filter(
      (c) => c.constructor.name === component.name,
    ) as C[]
  }

  /**
   * Method that returns several child providers, attached to this entity
   *
   * @param component defines the component type
   * @returns an array with objects that represents the component instance, attached to
   * this entity
   */
  public getAllProviders<P extends AbstractProvider>(provider: Type<P>): P[] {
    return this.providers.filter(
      (p) => p.constructor.name === provider.name,
    ) as P[]
  }

  /**
   * Method that adds a new component to a specific entity instance
   *
   * @param component defines the component type
   * @returns an object that represents the component instance
   */
  public addComponent<C extends AbstractComponent>(component: Type<C>): C {
    return this.game.addComponent(this, component)
  }

  /**
   * Method that adds a new provider to a specific entity instance
   *
   * @param provider defines the provider type
   * @returns an object that represents the provider instance
   */
  public addProvider<P extends AbstractProvider>(provider: Type<P>): P {
    return this.game.addProvider(this, provider)
  }

  /**
   * Method that detroyes some entity
   *
   * @param instance defines the instance that will be destroyed
   */
  public destroy<T extends AbstractEntity | AbstractComponent>(
    instance: T,
  ): void {
    this.game.destroy(instance)
  }

  /**
   * Method that returns some child component, attached to some entity
   *
   * @param component defines the component type
   * @returns an array of objects with the passed type
   */
  public find<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.game.find(component)
  }
}
