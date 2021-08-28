import { IAsteroidsApplication } from './interfaces/asteroids-application.interface'
import { Type } from './interfaces/type.interface'

/**
 * Class that represents some service in the game
 */
export abstract class AbstractProvider {
  public constructor(
    public game: IAsteroidsApplication,
    public providers: AbstractProvider[] = [],
  ) {}

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * the same parent entity
   */
  public getProvider<T extends AbstractProvider>(component: Type<T>): T {
    return this.providers.find(
      (c) => c.constructor.name === component.name,
    ) as T
  }
}
