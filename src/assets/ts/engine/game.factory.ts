import { Component } from './core/component'
import { Entity } from './core/entity'
import { GameFactoryOptions } from './interfaces/game-factory-options.interface'
import { ILoop } from './interfaces/loop.interface'
import { IStart } from './interfaces/start.interface'
import { Type } from './interfaces/type.interface'

/**
 * Class that represents the factory  responsible for instantiating all the
 * needed entities and their components and setting up the game
 */
export class GameFactory {
  /**
   * Property that defines a rendering context, used to render the game
   * entities
   */
  public static context: CanvasRenderingContext2D

  /**
   * Property that defines an array of entities, that represents all the instantiated entities in the game
   */
  private static instances: Entity[] = []

  /**
   * Property that defines an array of entities or the entity types
   */
  private static entities: (Entity | Type<Entity>)[] = []

  /**
   * Method used to define all the game options
   *
   * @param options defines an object that contains the game options
   */
  public static create(options?: GameFactoryOptions): void {
    const canvas = document.getElementById(
      'asteroidsjs-canvas',
    ) as HTMLCanvasElement

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.context = canvas.getContext('2d')

    this.entities.push(...options.entities)

    this.instances = this.entities.map((entity) => {
      if (!(entity instanceof Entity)) {
        entity = new entity()
      }
      return entity
    })
  }

  public static register<T extends Component, C extends Entity>(
    entity: Type<C>,
    components?: T[] | Type<T>[],
  ): C {
    const instance = new entity()
    instance.components = components.map((component) => {
      if (!(component instanceof Component)) {
        component = new component(instance)
      }
      return component
    })

    if (this.hasStart(instance)) {
      instance.start()
    }
    instance.components.forEach((component: Component) => {
      if (this.hasStart(component)) {
        component.start()
      }
    })

    this.instances.push(instance)
    return instance
  }

  /**
   * Method that start all the entity lifecyle methods
   */
  public static start(): void {
    for (const entity of this.instances) {
      if (this.hasStart(entity)) {
        entity.start()
      }

      entity.components.forEach((component: Component) => {
        if (this.hasStart(component)) {
          component.start()
        }
      })
    }

    setInterval(() => {
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height,
      )
      for (const entity of this.instances) {
        if (this.hasLoop(entity)) {
          entity.loop()
        }

        entity.components.forEach((component: Component) => {
          if (this.hasLoop(component)) {
            component.loop()
          }
        })
      }
    }, 5)
  }

  /**
   * Method that validates if some object is of type "ILoop"
   * @param object defines an object that will be validated
   * @returns true if the object implements the "ILoop" interface, otherwise
   * false
   */
  private static hasLoop(object: any): object is ILoop {
    return 'loop' in object
  }

  /**
   * Method that validates if some object is of type "IStart"
   * @param object defines an object that will be validated
   * @returns true if the object implements the "IStart" interface, otherwise
   * false
   */
  private static hasStart(object: any): object is IStart {
    return 'start' in object
  }
}
