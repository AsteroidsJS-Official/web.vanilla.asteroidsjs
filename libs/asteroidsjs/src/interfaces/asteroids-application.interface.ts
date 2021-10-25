import { AbstractEntity } from '../abstract-entity'

import { AbstractService } from '../abstract-service'

import { AbstractComponent } from '../abstract-component'

import { IInstantiateOptions } from './instantiate-options.interface'
import { IProvider } from './provider.interface'
import { Type } from './type.interface'

import { AbstractScene } from '../abstract-scene'

/**
 * Interface that represents the game instance.
 */
export interface IAsteroidsApplication {
  timeScale: number

  /**
   * Method that starts the game lifecycle.
   */
  start(): void

  /**
   * Method that can create a new project scene.
   *
   * @param scene defines the scene type.
   * @returns the created scene.
   */
  load<S extends AbstractScene>(scene: Type<S>): S

  /**
   * Method that can create a new project scene.
   *
   * @param scene defines the scene type.
   * @returns the created scene.
   */
  unload<S extends AbstractScene>(scene: string | S | Type<S>): void

  /**
   * Method that can create new entities.
   *
   * @param options defines an object that contains all the options.
   * needed to create a new entity.
   * @returns the created entity.
   */
  instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity

  /**
   * Method that finds some scene with the specified type.
   *
   * @param type defines the scene type.
   * @returns an object that represents the scene instance.
   */
  getScene<S extends AbstractScene>(type: Type<S>): S

  /**
   * Method that finds all the components of some type.
   *
   * @param component defines the component type.
   * @returns an array with all the found components.
   */
  find<C extends AbstractComponent>(component: Type<C>): C[]

  /**
   * Method that detroyes some entity.
   *
   * @param instance defines the instance that will be destroyed.
   */
  destroy<T extends AbstractEntity | AbstractComponent>(instance: T): void

  /**
   * Method that adds a new service to a specific entity instance.
   *
   * @param service defines the service type.
   * @returns an object that represents the service instance.
   */
  addService<E extends AbstractEntity, P extends AbstractService>(
    entity: E,
    service: Type<P>,
  ): P

  /**
   * Method that adds a new component to a specific entity instance.
   *
   * @param component defines the component type.
   * @returns an object that represents the component instance.
   */
  addComponent<E extends AbstractEntity, C extends AbstractComponent>(
    entity: E,
    component: Type<C> | IProvider<C>,
  ): C

  /**
   * Adds an intent to the intents array.
   *
   * @param intent a callback to be called in the end of the loop.
   */
  addIntent(intent: () => void): void

  /**
   * Removes an intent from the intents array.
   *
   * @param intent the intent to be removed.
   */
  removeIntent(intent: () => void): void
}
