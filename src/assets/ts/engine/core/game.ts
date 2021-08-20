/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { IDraw } from '../interfaces/draw.interface'
import { IInstantiateOptions } from '../interfaces/instantiate-options.interface'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'
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
      if (this.hasStart(instance)) {
        instance.start()
      }

      for (const component of instance.components) {
        if (this.hasStart(component)) {
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
        if (this.hasLoop(entity)) {
          entity.loop()
        }

        for (const component of entity.components) {
          if (this.hasLoop(component)) {
            component.loop()
          }
        }
      }
    }, 5)
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

    if (this.hasStart(instance)) {
      instance.start()
    }

    for (const component of instance.components) {
      if (this.hasStart(component)) {
        component.start()
      }
    }

    this.entities.push(instance)

    return instance as E extends Entity ? E : Entity
  }

  /**
   * Method that validates if some object is of type "ILoop"
   * @param loopObject defines an object that will be validated
   * @returns true if the object implements the "ILoop" interface, otherwise
   * false
   */
  public hasLoop(loopObject: any): loopObject is ILoop {
    return 'loop' in loopObject
  }

  /**
   * Method that validates if some object is of type "IStart"
   * @param startObject defines an object that will be validated
   * @returns true if the object implements the "IStart" interface, otherwise
   * false
   */
  public hasStart(startObject: any): startObject is IStart {
    return 'start' in startObject
  }

  /**
   * Method that validates if some object is of type "IDraw"
   * @param drawObject defines an object that will be validated
   * @returns true if the object implements the "IDraw" interface, otherwise
   * false
   */
  public hasDraw(drawObject: any): drawObject is IDraw {
    return 'draw' in drawObject
  }
}
