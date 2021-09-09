import { AbstractEntity, generateUUID, IContext, Type } from '..'

import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { ICanvasOptions } from './interfaces/canvas-options.interface'
import { IInstantiateOptions } from './interfaces/instantiate-options.interface'

/**
 * The scene represents a handler for entities in the game.
 *
 * Scenes can be created using the `load` method and passing the
 * scene class type as parameter. When a scene is unloaded, through the
 * `unload` method, all it child entities are destroyed like it
 * components.
 */
export abstract class AbstractScene {
  /**
   * Property that defines an object that represents the canvas context
   */
  private _context: IContext

  constructor(
    readonly id: number | string,
    readonly game: IAsteroidsApplication,
    public entities: AbstractEntity[] = [],
  ) {}

  /**
   * Method that can create a new project scene
   *
   * @param scene defines the scene type
   * @returns the created scene
   */
  load<S extends AbstractScene>(scene: Type<S>): S {
    return this.game.load(scene)
  }

  /**
   * Method that unloads some specified scene.
   *
   * @param scene defines the scene id, type or instance
   */
  async unload<S extends AbstractScene>(
    scene: string | S | Type<S>,
  ): Promise<void> {
    await this.game.unload(scene)
    if (document.getElementById(this._context.canvas.id)) {
      document.querySelector('body').removeChild(this._context.canvas)
    }
  }

  /**
   * Method that creates a new canvas for rendering the game entities
   *
   * @param options defines an object that represents the canvas
   * creation options
   * @returns the created canvas context
   */
  createCanvas(options?: ICanvasOptions): IContext {
    const canvas = document.createElement('canvas')
    canvas.id = generateUUID()

    options ??= {} as ICanvasOptions
    canvas.width = options.width ?? window.innerWidth
    canvas.height = options.height ?? window.innerHeight

    document.querySelector('body').appendChild(canvas)

    this._context = canvas.getContext('2d')
    return this._context
  }

  /**
   * Method that can create new entities
   *
   * @param options defines the entity options when intantiating it
   * @returns the created entity
   */
  instantiate<E extends AbstractEntity>(
    options?: IInstantiateOptions<E>,
  ): E extends AbstractEntity ? E : AbstractEntity {
    options.scene ??= this
    return this.game.instantiate(options)
  }

  /**
   * Method that returns the game context
   *
   * @returns an object that represents the game context
   */
  getContext(): IContext {
    return this._context
  }

  /**
   * Method that returns all the entities instantiated in this scene
   *
   * @returns an array with all the found entities
   */
  getEntities(): AbstractEntity[] {
    return this.entities
  }
}
