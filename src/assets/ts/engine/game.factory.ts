import { hasStart, hasLoop, hasAwake, isEntity } from './utils/validations'

import { IScreen } from '../interfaces/screen.interface'
import { Component } from './component'
import { REQUIRE_COMPONENTS } from './constants'
import { Entity } from './entity'
import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { GameFactoryOptions } from './interfaces/game-factory-options.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'
import { Type } from './interfaces/type.interface'

/**
 * Class that represents the main application behaviour
 */
class AsteroidsApplication implements IAsteroidsApplication {
  /**
   * Property that defines an array of entities, that represents all the
   * instantiated entities in the game
   */
  private entities: Entity[] = []

  /**
   * Property that defines an array of components, that represents all the
   * instantiated components in the game
   */
  private components: Component[] = []

  /**
   * Property that returns the canvas context
   * @returns the canvas context
   */
  public getContext(): CanvasRenderingContext2D {
    return this.context
  }

  /**
   * Property that returns the screen data
   * @returns the screen data
   */
  public getScreen(): IScreen {
    return this.screen
  }

  public constructor(
    private readonly screen: IScreen,
    private readonly context: CanvasRenderingContext2D,
    private readonly bootstrap: Type<Entity>[],
  ) {}

  /**
   * Method that starts the game lifecycle
   */
  public start(): void {
    this.bootstrap.forEach((entity) => this.instantiate({ entity }))

    setInterval(() => {
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height,
      )
      ;[this.entities, ...this.components].forEach((value) => {
        if (hasLoop(value)) {
          value.onLoop()
        }
      })
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

    const requiredComponents: Type<Component>[] = []

    if (options && options.components) {
      options.components.forEach((component) => {
        requiredComponents.push(...this.getRequiredComponents(component))
      })
      requiredComponents.forEach((component) => {
        if (!options.components.includes(component)) {
          throw new Error(
            `Component ${component.name} is required in ${options.entity.name} entity`,
          )
        }
      })
    }

    instance.components = (options.components ?? []).map(
      (component) => new component(this, instance),
    )

    const instances = [instance, ...instance.components]

    instances.forEach((value) => {
      if (hasAwake(value)) {
        value.onAwake()
      }
    })
    instances.forEach((value) => {
      if (hasStart(value)) {
        value.onStart()
      }
    })

    this.entities.push(instance)
    this.components.push(...instance.components)

    return instance as E extends Entity ? E : Entity
  }

  /**
   * Method that finds all the components of some type
   *
   * @param component defines the component type
   * @returns an array with all the found components
   */
  public find<C extends Component>(component: Type<C>): C[] {
    return this.components.filter(
      (c) => c.constructor.name === component.name,
    ) as C[]
  }

  /**
   * Method that detroyes some entity
   *
   * @param instance defines the instance that will be destroyed
   */
  public destroy<T extends Entity | Component>(instance: T): void {
    if (isEntity(instance)) {
      this.entities = this.entities.filter((entity) => entity !== instance)
      instance.components.forEach((component) => this.destroy(component))
    }

    this.components = this.components.filter(
      (component) => component !== instance,
    )
  }

  private getRequiredComponents(component: Type<Component>): Type<Component>[] {
    return Reflect.getMetadata(REQUIRE_COMPONENTS, component) ?? []
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

    canvas.width = options.screen.width || window.innerWidth
    canvas.height = options.screen.height || window.innerHeight
    canvas.style.transform = `translateX(${-options.displacement || 0}px)`

    return new AsteroidsApplication(
      options.screen,
      canvas.getContext('2d'),
      options.bootstrap,
    )
  }
}
