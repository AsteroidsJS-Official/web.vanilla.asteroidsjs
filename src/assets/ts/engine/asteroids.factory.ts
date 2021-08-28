import { hasStart, hasLoop, hasAwake, isEntity } from './utils/validations'

import { IScreen } from '../interfaces/screen.interface'
import { AbstractComponent } from './abstract-component'
import { AbstractEntity } from './abstract-entity'
import { AbstractProvider } from './abstract-provider'
import {
  COMPONENT_OPTIONS,
  ENTITY_OPTIONS,
  PROVIDER_OPTIONS,
  REQUIRE_COMPONENTS,
} from './constants'
import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { IEntityOptions } from './interfaces/entity-options.interface'
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
  public instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity {
    const instance =
      options && options.entity
        ? new options.entity(this)
        : new AbstractEntity(this)

    this.extendEntityMetadata(options.entity, {
      components: options.components,
      providers: options.providers,
    })

    const components = this.getComponents(options.entity)
    const providers = this.getProviders(options.entity)

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

    if (components && components.length) {
      instance.components = components.map(
        (component) => new component(this, instance),
      )
    }
    if (providers && providers.length) {
      instance.providers = providers.map((provider) =>
        this.createAndRegisterProvider(provider),
      )
    }

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

  private extendEntityMetadata<E extends AbstractEntity>(
    entity?: Type<E>,
    options?: IEntityOptions,
  ): void {
    const metadata: IInstantiateOptions<E> = Reflect.getMetadata(
      ENTITY_OPTIONS,
      entity,
    )

    metadata.components = [
      ...(metadata.components ?? []),
      ...(options.components ?? []),
    ]
    metadata.providers = [
      ...(metadata.providers ?? []),
      ...(options.providers ?? []),
    ]

    Reflect.defineMetadata(ENTITY_OPTIONS, metadata, entity)
  }

  private getComponents<T extends AbstractEntity>(
    entity: Type<T>,
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

  private createAndRegisterProvider(
    provider: Type<AbstractProvider>,
  ): AbstractProvider {
    let instance = this.providers.find(
      (p) => p.constructor.name === provider.name,
    )

    if (!instance) {
      const providers = this.getProviders(provider).map((p) =>
        this.createAndRegisterProvider(p),
      )
      instance = new provider()
      instance.providers = providers
    }

    return instance
  }

  private getRequiredComponents(
    component: Type<AbstractComponent>,
  ): Type<AbstractComponent>[] {
    return Reflect.getMetadata(REQUIRE_COMPONENTS, component) ?? []
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
