import { hasStart, hasLoop, hasAwake, isEntity } from './utils/validations'

import { IScreen } from '../interfaces/screen.interface'
import { AbstractComponent } from './abstract-component'
import { AbstractEntity } from './abstract-entity'
import { AbstractProvider } from './abstract-provider'
import {
  COMPONENT_OPTIONS,
  ENTITY_OPTIONS,
  PROVIDER_OPTIONS,
} from './constants'
import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { IComponentProperty } from './interfaces/component-property.interface'
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
  private entities: AbstractEntity[] = []

  /**
   * Property that defines an array of components, that represents all the
   * instantiated components in the game
   */
  private components: AbstractComponent[] = []

  /**
   * Property that defines an array of providers, that represents all the
   * instantiated providers in the game
   */
  private providers: AbstractProvider[] = []

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
    private readonly bootstrap: Type<AbstractEntity>[],
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
      ;[...this.entities, ...this.components].forEach((value) => {
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
  public instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity {
    const instance =
      options && options.entity
        ? new options.entity(this)
        : new AbstractEntity(this)

    if (options.use) {
      for (const key in options.use) {
        if (key in instance) {
          ;(instance as any)[key] = options.use[key]
        }
      }
    }

    const components = [
      ...new Set([
        ...this.getComponents(options.entity),
        ...(options.components ?? []),
      ]),
    ]
    const providers = [
      ...new Set([
        ...this.getProviders(options.entity),
        ...(options.providers ?? []),
      ]),
    ]
    const properties = [
      ...this.getProperties(options.entity),
      ...(options.properties ?? []),
    ]

    if (components && components.length) {
      const requiredComponents: Type<AbstractComponent>[] = []
      components.forEach((component) => {
        requiredComponents.push(...this.getRequiredComponents(component))
      })
      requiredComponents.forEach((component) => {
        if (!components.includes(component)) {
          throw new Error(
            `Component ${component.name} is required in ${options.entity.name} entity`,
          )
        }
      })
    }

    if (providers && providers.length) {
      instance.providers = providers.map((provider) =>
        this.findOrCreateProvider(provider),
      )
    }
    if (components && components.length) {
      instance.components = components.map((component) => {
        const i = new component(this, instance)
        const value = properties.find((p) => p.for === component)?.use

        if (value) {
          for (const key in value) {
            if (key in i) {
              ;(i as any)[key] = value[key]
            }
          }
        }
        return i
      })
    }

    instance.providers.forEach((provider) => {
      if (hasAwake(provider)) {
        provider.onAwake()
      }
    })

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

    return instance as E extends AbstractEntity ? E : AbstractEntity
  }

  /**
   * Method that adds a new component to a specific entity instance
   *
   * @param component defines the component type
   * @returns an object that represents the component instance
   */
  public addComponent<E extends AbstractEntity, C extends AbstractComponent>(
    entity: E,
    component: Type<C>,
  ): C {
    const c = new component(this, entity)
    entity.components.push(c)
    this.components.push(c)
    return c
  }

  /**
   * Method that adds a new provider to a specific entity instance
   *
   * @param provider defines the provider type
   * @returns an object that represents the provider instance
   */
  public addProvider<E extends AbstractEntity, P extends AbstractProvider>(
    entity: E,
    provider: Type<P>,
  ): P {
    const p = this.findOrCreateProvider(provider)
    entity.providers.push(p)
    return p
  }

  /**
   * Method that finds all the components of some type
   *
   * @param component defines the component type
   * @returns an array with all the found components
   */
  public find<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.components.filter(
      (c) => c.constructor.name === component.name,
    ) as C[]
  }

  /**
   * Method that detroyes some entity
   *
   * @param instance defines the instance that will be destroyed
   */
  public destroy<T extends AbstractEntity | AbstractComponent>(
    instance: T,
  ): void {
    if (isEntity(instance)) {
      this.entities = this.entities.filter((entity) => entity !== instance)
      instance.components.forEach((component) => this.destroy(component))
      return
    }
    this.components = this.components.filter(
      (component) => component !== instance,
    )
  }

  private getComponents<E extends AbstractEntity>(
    entity: Type<E>,
  ): Type<AbstractComponent>[] {
    return Reflect.getMetadata(ENTITY_OPTIONS, entity)?.components ?? []
  }

  private getProviders<
    T extends AbstractEntity | AbstractProvider | AbstractComponent,
  >(target: Type<T>): Type<AbstractProvider>[] {
    return (
      Reflect.getMetadata(ENTITY_OPTIONS, target)?.providers ??
      Reflect.getMetadata(PROVIDER_OPTIONS, target)?.providers ??
      Reflect.getMetadata(COMPONENT_OPTIONS, target)?.providers ??
      []
    )
  }

  private getProperties<E extends AbstractEntity>(
    target: Type<E>,
  ): IComponentProperty[] {
    return Reflect.getMetadata(ENTITY_OPTIONS, target)?.properties ?? []
  }

  private findOrCreateProvider<P extends AbstractProvider>(
    provider: Type<P>,
  ): P {
    let instance = this.providers.find(
      (p) => p.constructor.name === provider.name,
    )
    if (!instance) {
      const providers = this.getProviders(provider).map((p) =>
        this.findOrCreateProvider(p),
      )
      instance = new provider(this, providers)
      this.providers.push(instance)
    }
    return instance as P
  }

  private getRequiredComponents(
    component: Type<AbstractComponent>,
  ): Type<AbstractComponent>[] {
    return Reflect.getMetadata(COMPONENT_OPTIONS, component)?.required ?? []
  }
}

/**
 * Class that represents the factory  responsible for instantiating all the
 * needed entities and their components and setting up the game
 */
export class AsteroidsFactory {
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
