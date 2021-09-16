import { AbstractEntity } from './abstract-entity'

import { AbstractService } from './abstract-service'

import { IContext } from './interfaces/context.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'
import { Type } from './interfaces/type.interface'

/**
 * Class that can be passed as dependency for objects of type `Entity`. It
 * can be used to add new behaviours to these entities
 */
export abstract class AbstractComponent {
  /**
   * Property that defines some tag allowing to differ thngs in collider
   * behaviours
   */
  get tag(): string {
    return this.entity.tag
  }

  /**
   * Property that defines a number used to synchronize the application
   * physics.
   */
  get deltaTime(): number {
    return this.entity.deltaTime
  }

  constructor(readonly id: string | number, readonly entity: AbstractEntity) {}

  /**
   * Method that recalculates the component delta time.
   *
   * It must be invoked in the begining of the "onFixedLoop" method, before
   * any other instruction, in order to keep the component physics
   * synchronized.
   */
  refreshDeltaTime(): void {
    this.entity.refreshDeltaTime()
  }

  /**
   * Method that returns the entity with some class or interface type
   *
   * @returns the entity as some specified type
   */
  getEntityAs<T>(): T {
    return this.entity.getEntityAs<T>()
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
    return this.entity.instantiate(options)
  }

  /**
   * Method that returns the game context
   * @returns an object that represents the game context
   */
  getContext(): IContext {
    return this.entity.getContext()
  }

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * the same parent entity
   */
  getService<T extends AbstractService>(component: Type<T>): T {
    return this.entity.getService(component)
  }

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * the same parent entity
   */
  getComponent<T extends AbstractComponent>(component: Type<T>): T {
    return this.entity.getComponent(component)
  }

  /**
   * Method that returns several child components, attached to this entity
   *
   * @param component defines the component type
   * @returns an array with objects that represents the component instance, attached to
   * this entity
   */
  getComponents<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.entity.getComponents(component)
  }

  /**
   * Method that returns several child services, attached to this entity
   *
   * @param component defines the component type
   * @returns an array with objects that represents the component instance, attached to
   * this entity
   */
  getServices<P extends AbstractService>(service: Type<P>): P[] {
    return this.entity.getServices(service)
  }

  /**
   * Method that returns all the components attached to this entity
   *
   * @returns an array with objects that represents all the components
   */
  getAllComponents(): AbstractComponent[] {
    return this.entity.getAllComponents()
  }

  /**
   * Method that returns all the services attached to this entity
   *
   * @returns an array with objects that represents all the services
   */
  getAllServices(): AbstractService[] {
    return this.entity.getAllServices()
  }

  /**
   * Method that adds a new service to a specific entity instance
   *
   * @param service defines the service type
   * @returns an object that represents the service instance
   */
  addService<P extends AbstractService>(service: Type<P>): P {
    return this.entity.addService(service)
  }

  /**
   * Method that returns some child component, attached to some entity
   *
   * @param component defines the component type
   * @returns an array of objects with the passed type
   */
  find<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.entity.find(component)
  }

  /**
   * Method that detroyes some entity
   *
   * @param instance defines the instance that will be destroyed
   */
  async destroy<T extends AbstractEntity | AbstractComponent>(
    instance: T,
  ): Promise<void> {
    await this.entity.destroy(instance)
  }
}
