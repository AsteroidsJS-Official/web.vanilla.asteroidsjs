import { AbstractService } from './abstract-service'

import { AbstractComponent } from './abstract-component'

import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { IContext } from './interfaces/context.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'
import { Type } from './interfaces/type.interface'

/**
 * Class that represents some object in the game
 */
export class AbstractEntity {
  /**
   * Property that defines the entity unique id
   */
  id: number | string

  /**
   * Property that defines some tag allowing to differ thngs in collider
   * behaviours
   */
  tag: string

  constructor(
    readonly game: IAsteroidsApplication,
    public components: AbstractComponent[] = [],
    public services: AbstractService[] = [],
  ) {}

  /**public
   * Method that returns the entity with some class or interface type
   *
   * @returns the entity as some specified type
   */
  getEntityAs<T>(): T {
    return this as unknown as T
  }

  /**
   * Method that can create new entities
   *
   * @param entity defines the new entity type
   * @param components defines the new entity component dependencies
   * @returns the created entity
   */
  instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity {
    return this.game.instantiate(options)
  }

  /**
   * Method that returns the game context
   * @returns an object that represents the game context
   */
  getContext(): IContext {
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
  getService<P extends AbstractService>(component: Type<P>): P {
    return this.services.find((c) => c.constructor.name === component.name) as P
  }

  /**
   * Method that returns some child component, attached to this entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * this entity
   */
  getComponent<C extends AbstractComponent>(component?: Type<C>): C {
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
  getComponents<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.components.filter(
      (c) => c.constructor.name === component.name,
    ) as C[]
  }

  /**
   * Method that returns several child services, attached to this entity
   *
   * @param component defines the component type
   * @returns an array with objects that represents the component instance, attached to
   * this entity
   */
  getServices<P extends AbstractService>(service: Type<P>): P[] {
    return this.services.filter(
      (p) => p.constructor.name === service.name,
    ) as P[]
  }

  /**
   * Method that returns all the components attached to this entity
   *
   * @returns an array with objects that represents all the components
   */
  getAllComponents(): AbstractComponent[] {
    return this.components
  }

  /**
   * Method that returns all the services attached to this entity
   *
   * @returns an array with objects that represents all the services
   */
  getAllServices(): AbstractService[] {
    return this.services
  }

  /**
   * Method that adds a new component to a specific entity instance
   *
   * @param component defines the component type
   * @returns an object that represents the component instance
   */
  addComponent<C extends AbstractComponent>(component: Type<C>): C {
    return this.game.addComponent(this, component)
  }

  /**
   * Method that adds a new service to a specific entity instance
   *
   * @param service defines the service type
   * @returns an object that represents the service instance
   */
  addService<P extends AbstractService>(service: Type<P>): P {
    return this.game.addService(this, service)
  }

  /**
   * Method that detroyes some entity
   *
   * @param instance defines the instance that will be destroyed
   */
  destroy<T extends AbstractEntity | AbstractComponent>(instance: T): void {
    this.game.destroy(instance)
  }

  /**
   * Method that returns some child component, attached to some entity
   *
   * @param component defines the component type
   * @returns an array of objects with the passed type
   */
  find<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.game.find(component)
  }
}
