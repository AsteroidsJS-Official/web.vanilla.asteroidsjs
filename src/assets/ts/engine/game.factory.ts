import { hasStart, hasLoop } from './utils/validations'

import { IScreen } from '../interfaces/screen.interface'
import { Component } from './core/component'
import { Entity } from './core/entity'
import { IAsteroidsApplication } from './core/interfaces/asteroids-application.interface'
import { GameFactoryOptions } from './core/interfaces/game-factory-options.interface'
import { IInstantiateOptions } from './core/interfaces/instantiate-options.interface'
import { Type } from './core/interfaces/type.interface'

/**
 * Class that represents the main application behaviour
 */
class AsteroidsApplication implements IAsteroidsApplication {
  /**
   * Property that defines a rendering context, used to render the game
   * entities
   */
  public context: CanvasRenderingContext2D

  /**
   * Property that defines the current screen number
   */
  public screenNumber: number

  /**
   * Property that defines an array of entities, that represents all the
   * initial instantiated entities in the game
   */
  public bootstrap: Entity[] = []

  /**
   * Property that defines an array of entities, that represents all the
   * instantiated entities in the game
   */
  public instances: Entity[] = []

  /**
   * Method that starts the game lifecycle
   */
  public start(): void {
    for (const instance of this.bootstrap) {
      if (hasStart(instance)) {
        instance.onStart()
      }

      for (const component of instance.components) {
        if (hasStart(component)) {
          component.onStart()
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
      for (const entity of this.instances) {
        if (hasLoop(entity)) {
          entity.onLoop()
        }

        for (const component of entity.components) {
          if (hasLoop(component)) {
            component.onLoop()
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
      instance.onStart()
    }

    for (const component of instance.components) {
      if (hasStart(component)) {
        component.onStart()
      }
    }

    this.instances.push(instance)

    return instance as E extends Entity ? E : Entity
  }

  public findAll<C extends Component>(component: Type<C>): C[] {
    return
  }

  getContext(): CanvasRenderingContext2D {
    return
  }

  getScreen(): IScreen {
    return {} as IScreen
  }
}

/**
 * Class that represents the factory  responsible for instantiating all the
 * needed entities and their components and setting up the game
 */
export class GameFactory {
  /**
   * Method used to define all the game options
   *
   * @param options defines an object that contains the game options
   */
  public static create(options?: GameFactoryOptions): AsteroidsApplication {
    const canvas = document.getElementById(
      'asteroidsjs-canvas',
    ) as HTMLCanvasElement

    canvas.width = options.width || window.innerWidth
    canvas.height = options.height || window.innerHeight

    canvas.style.transform = `translateX(${-options.displacement || 0}px)`

    const game = new AsteroidsApplication()

    game.screenNumber = options.screenNumber
    game.context = canvas.getContext('2d')
    game.bootstrap.push(...options.bootstrap.map((entity) => new entity(game)))

    return game
  }
}
