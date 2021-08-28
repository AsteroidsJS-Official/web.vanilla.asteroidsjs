import { AbstractEntity } from './abstract-entity'
import { AbstractProvider } from './abstract-provider'
import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
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
