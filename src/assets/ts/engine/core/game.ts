/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { hasLoop, hasStart } from '../utils/validations'

import { IInstantiateOptions } from '../interfaces/instantiate-options.interface'
import { Entity } from './entity'

/**
 * Class that represents the main application behaviour
 */
export class Game {
  /**
   * Property that defines a rendering context, used to render the game
   * entities
   */
  public context: CanvasRenderingContext2D

  /**
   * Property that defines an array of entities, that represents all the
   * initial instantiated entities in the game
   */
  public bootstrap: Entity[] = []

  /**
   * Property that defines an array of entities, that represents all the
   * instantiated entities in the game
   */
  public entities: Entity[] = []

  /**
   * Method that starts the game lifecycle
   */
  public start(): void {
    for (const instance of this.bootstrap) {
      if (hasStart(instance)) {
        instance.start()
      }

      for (const component of instance.components) {
        if (hasStart(component)) {
          component.start()
        }
      }
    }

    setInterval(() => {
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height,
      )
      for (const entity of this.entities) {
        if (hasLoop(entity)) {
          entity.loop()
        }

        for (const component of entity.components) {
          if (hasLoop(component)) {
            component.loop()
          }
        }
      }
    }, 100 / 6)
  }

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
    const instance =
      options && options.entity ? new options.entity(this) : new Entity(this)

    instance.components = options.components.map(
      (component) => new component(this, instance),
    )

    if (hasStart(instance)) {
      instance.start()
    }

    for (const component of instance.components) {
      if (hasStart(component)) {
        component.start()
      }
    }

    this.entities.push(instance)

    return instance as E extends Entity ? E : Entity
  }
}
