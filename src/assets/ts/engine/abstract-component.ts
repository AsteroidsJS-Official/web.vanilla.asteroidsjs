import { AbstractEntity } from './abstract-entity'

import { AbstractProvider } from './abstract-provider'

import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { IContext } from './interfaces/context.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'
import { Type } from './interfaces/type.interface'

/**
 * Class that can be passed as dependency for objects of type `Entity`. It
 * can be used to add new behaviours to these entities
 */
export abstract class AbstractComponent {
  public constructor(
    public readonly game: IAsteroidsApplication,
    public readonly entity: AbstractEntity,
  ) {}

  /**
   * Method that returns the entity with some class or interface type
   *
   * @returns the entity as some specified type
   */
  public getEntityAs<T>(): T {
    return this.entity.getEntityAs<T>()
  }

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
    return this.entity.instantiate(options)
  }

  /**
   * Method that returns the game context
   * @returns an object that represents the game context
   */
  public getContext(): IContext {
    return this.game.getContext()
  }

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * the same parent entity
   */
  public getProvider<T extends AbstractProvider>(component: Type<T>): T {
    return this.entity.getProvider(component)
  }

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * the same parent entity
   */
  public getComponent<T extends AbstractComponent>(component: Type<T>): T {
    return this.entity.getComponent(component)
  }

  /**
   * Method that returns several child components, attached to this entity
   *
   * @param component defines the component type
   * @returns an array with objects that represents the component instance, attached to
   * this entity
   */
  public getComponents<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.entity.getComponents(component)
  }

  /**
   * Method that returns several child providers, attached to this entity
   *
   * @param component defines the component type
   * @returns an array with objects that represents the component instance, attached to
   * this entity
   */
  public getProviders<P extends AbstractProvider>(provider: Type<P>): P[] {
    return this.entity.getProviders(provider)
  }

  /**
   * Method that returns all the components attached to this entity
   *
   * @returns an array with objects that represents all the components
   */
  public getAllComponents(): AbstractComponent[] {
    return this.entity.getAllComponents()
  }

  /**
   * Method that returns all the providers attached to this entity
   *
   * @returns an array with objects that represents all the providers
   */
  public getAllProviders(): AbstractProvider[] {
    return this.entity.getAllProviders()
  }

  /**
   * Method that adds a new provider to a specific entity instance
   *
   * @param provider defines the provider type
   * @returns an object that represents the provider instance
   */
  public addProvider<P extends AbstractProvider>(provider: Type<P>): P {
    return this.game.addProvider(this.entity, provider)
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
}
