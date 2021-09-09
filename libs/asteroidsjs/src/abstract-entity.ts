import { AbstractService } from './abstract-service'

import { AbstractComponent } from './abstract-component'

import { IContext } from './interfaces/context.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'
import { Type } from './interfaces/type.interface'

import { AbstractScene } from './abstract-scene'

/**
 * Class that represents some object in the game
 */
export abstract class AbstractEntity {
  /**
   * Property that defines some tag allowing to differ thngs in collider
   * behaviours
   */
  tag: string

  constructor(
    readonly id: string | number,
    public scene: AbstractScene,
    public components: AbstractComponent[] = [],
    public services: AbstractService[] = [],
  ) {}

  /**
   * Method that returns the entity with some class or interface type
   *
   * @returns the entity as some specified type
   */
  public getEntityAs<T>(): T {
    return this as unknown as T
  }

  /**
   * Method that can create new entities
   *
   * @param options defines the entity options when intantiating it
   * @returns the created entity
   */
  instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity {
    return this.scene.instantiate(options)
  }

  /**
   * Method that returns the game context
   *
   * @returns an object that represents the game context
   */
  getContext(): IContext {
    return this.scene.getContext()
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
    return this.scene.game.addComponent(this, component)
  }

  /**
   * Method that adds a new service to a specific entity instance
   *
   * @param service defines the service type
   * @returns an object that represents the service instance
   */
  addService<P extends AbstractService>(service: Type<P>): P {
    return this.scene.game.addService(this, service)
  }

  /**
   * Method that detroyes some entity
   *
   * @param instance defines the instance that will be destroyed
   */
  destroy<T extends AbstractEntity | AbstractComponent>(instance: T): void {
    this.scene.game.destroy(instance)
  }

  /**
   * Method that returns some child component, attached to some entity
   *
   * @param component defines the component type
   * @returns an array of objects with the passed type
   */
  find<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.scene.game.find(component)
  }
}
