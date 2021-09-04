import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { Type } from './interfaces/type.interface'

/**
 * Class that represents some service in the game
 */
export abstract class AbstractService {
  constructor(
    readonly id: string | number,
    public game: IAsteroidsApplication,
    public services: AbstractService[] = [],
  ) {}

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity
   *
   * @param service defines the component type
   * @returns an object that represents the component instance, attached to
   * the same parent entity
   */
  getService<T extends AbstractService>(service: Type<T>): T {
    return this.services.find((c) => c.constructor.name === service.name) as T
  }
}
