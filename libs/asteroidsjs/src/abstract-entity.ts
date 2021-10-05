import { AbstractService } from './abstract-service'

import { AbstractComponent } from './abstract-component'

import { IContext } from './interfaces/context.interface'
import { IEnabled } from './interfaces/enabled.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'
import { Type } from './interfaces/type.interface'

import { AbstractScene } from './abstract-scene'

/**
 * Class that represents some object in the game
 */
export abstract class AbstractEntity implements IEnabled {
  /**
   * Property that defines the rendering order of each entity.
   */
  order = 0

  /**
   * Property that defines a number used to synchronize the application
   * physics.
   */
  deltaTime = 0

  /**
   * Property that defines some tag allowing to differ things in collider
   * behaviours
   */
  tag = ''

  /**
   * Property that enables the entity.
   *
   * All "loop" methods such as "onLoop" or "onLateLoop" are only executed
   * when the structure is activated, as well as its children's "loop"
   * methods.
   *
   * In this case, when the entity is disabled, child entities and
   * their components are also.
   */
  private _enabled = true

  /**
   * Property that defines a number that represents the last time saved for
   * this entity.
   */
  private _lastTime: number

  /**
   * Property that enables the entity.
   *
   * All "loop" methods such as "onLoop" or "onLateLoop" are only executed
   * when the structure is activated, as well as its children's "loop"
   * methods.
   *
   * In this case, when the entity is disabled, child entities and
   * their components are also.
   */
  get enabled(): boolean {
    return this._enabled && this.scene?.enabled
  }

  /**
   * Property that enables the entity.
   *
   * All "loop" methods such as "onLoop" or "onLateLoop" are only executed
   * when the structure is activated, as well as its children's "loop"
   * methods.
   *
   * In this case, when the entity is disabled, child entities and
   * their components are also.
   */
  set enabled(value: boolean) {
    this._enabled = value
  }

  constructor(
    readonly id: string | number,
    public scene: AbstractScene,
    public components: AbstractComponent[] = [],
    public services: AbstractService[] = [],
  ) {}

  /**
   * Method that recalculates the entity delta time.
   *
   * It must be invoked in the begining of the "onFixedLoop" method, before
   * any other instruction, in order to keep the entity physics
   * synchronized.
   */
  refreshDeltaTime(): void {
    const aux = this._lastTime || Date.now()
    this._lastTime = Date.now()
    this.deltaTime = Date.now() - aux
  }

  /**
   * Method that returns the entity with some class or interface type.
   *
   * @returns the entity as some specified type.
   */
  public getEntityAs<T>(): T {
    return this as unknown as T
  }

  /**
   * Method that can create new entities.
   *
   * @param options defines the entity options when intantiating it.
   * @returns the created entity.
   */
  instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity {
    return this.scene.instantiate(options)
  }

  /**
   * Method that returns the game context.
   *
   * @returns an object that represents the game context.
   */
  getContexts(): IContext[] {
    return this.scene.getContexts()
  }

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity.
   *
   * @param component defines the component type.
   * @returns an object that represents the component instance, attached to
   * the same parent entity.
   */
  getService<P extends AbstractService>(component: Type<P>): P {
    return this.services.find((c) => c.constructor.name === component.name) as P
  }

  /**
   * Method that returns some child component, attached to this entity.
   *
   * @param component defines the component type.
   * @returns an object that represents the component instance, attached to
   * this entity.
   */
  getComponent<C extends AbstractComponent>(component?: Type<C>): C {
    return this.components.find(
      (c) => c.constructor.name === component.name,
    ) as C
  }

  /**
   * Method that returns several child components, attached to this entity.
   *
   * @param component defines the component type.
   * @returns an array with objects that represents the component instance,
   * attached to this entity.
   */
  getComponents<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.components.filter(
      (c) => c.constructor.name === component.name,
    ) as C[]
  }

  /**
   * Method that returns several child services, attached to this entity
   *
   * @param component defines the component type.
   * @returns an array with objects that represents the component instance,
   * attached to this entity.
   */
  getServices<P extends AbstractService>(service: Type<P>): P[] {
    return this.services.filter(
      (p) => p.constructor.name === service.name,
    ) as P[]
  }

  /**
   * Method that returns all the components attached to this entity.
   *
   * @returns an array with objects that represents all the components.
   */
  getAllComponents(): AbstractComponent[] {
    return this.components
  }

  /**
   * Method that returns all the services attached to this entity.
   *
   * @returns an array with objects that represents all the services.
   */
  getAllServices(): AbstractService[] {
    return this.services
  }

  /**
   * Method that adds a new component to a specific entity instance.
   *
   * @param component defines the component type.
   * @returns an object that represents the component instance.
   */
  addComponent<C extends AbstractComponent>(component: Type<C>): C {
    return this.scene.game.addComponent(this, component)
  }

  /**
   * Method that adds a new service to a specific entity instance.
   *
   * @param service defines the service type.
   * @returns an object that represents the service instance.
   */
  addService<P extends AbstractService>(service: Type<P>): P {
    return this.scene.game.addService(this, service)
  }

  /**
   * Method that detroyes some entity.
   *
   * @param instance defines the instance that will be destroyed.
   */
  destroy<T extends AbstractEntity | AbstractComponent>(instance: T): void {
    this.scene.game.destroy(instance)
  }

  /**
   * Method that returns some child component, attached to some entity.
   *
   * @param component defines the component type.
   * @returns an array of objects with the passed type.
   */
  find<C extends AbstractComponent>(component: Type<C>): C[] {
    return this.scene.game.find(component)
  }

  /**
   * Adds tags to the current entity according to the given array.
   *
   * @param tags an array of tags to be added to the current entity.
   *
   * @example
   * addTags('tag1', 'tag2')
   */
  addTags(...tags: string[]): void {
    tags.forEach((tag) => {
      this.tag = this.tag ? this.tag + `|${tag}` : tag
    })
  }

  /**
   * Removes tags from the current entity according to the given array.
   *
   * @param tags an array of tags to be removed from the current entity.
   *
   * @example
   * removeTags('tag1', 'tag2')
   */
  removeTags(...tags: string[]): void {
    tags.forEach((tag) => {
      if (!this.hasTag(tag)) {
        return
      }

      this.tag = this.tag
        .replace(tag, '')
        .split('|')
        .filter((t) => !!t)
        .join('|')
    })
  }

  /**
   * Verifies whether the given tag is present in the current entity.
   *
   * @param tag the tag to be checked.
   * @returns whether the current entity has the given tag.
   */
  hasTag(tag: string): boolean {
    return this.tag && this.tag.includes(tag)
  }

  /**
   * Gets an array of tags from the current entity.
   *
   * @returns an array of tags.
   */
  getTags(): string[] {
    return this.tag.split('|')
  }

  /**
   * Adds an intent to the intents array.
   *
   * @param intent a callback to be called in the end of the loop.
   */
  addIntent(intent: () => void): void {
    this.scene.addIntent(intent)
  }

  /**
   * Removes an intent from the intents array.
   *
   * @param intent the intent to be removed.
   */
  removeIntent(intent: () => void): void {
    this.scene.removeIntent(intent)
  }
}
