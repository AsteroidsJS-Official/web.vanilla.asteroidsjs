import { IInstantiateOptions } from '../interfaces/instantiate-options.interface'
import { Type } from '../interfaces/type.interface'
import { Entity } from './entity'
import { Game } from './game'

/**
 * Class that can be passed as dependency for objects of type `Entity`. It
 * can be used to add new behaviours to these entities
 */
export abstract class Component {
  public constructor(
    public readonly game: Game,
    public readonly entity: Entity,
  ) {}

  /**
   * Method that can create new entities
   *
   * @param entity defines the new entity type
   * @param components defines the new entity component dependencies
   * @returns the created entity
   */
  public instantiate<E extends Entity, t>(
    options?: IInstantiateOptions<E>,
  ): E extends Entity ? E : Entity {
    return this.entity.instantiate(options)
  }

  /**
   * Method that returns some sibling component, attached to the same parent
   * entity
   *
   * @param component defines the component type
   * @returns an object that represents the component instance, attached to
   * the same parent entity
   */
  public getComponent<T extends Component>(component: Type<T>): T {
    return this.entity.getComponent(component)
  }

  /**
   * Method that asserts that this component parent has some specified
   * component as dependency
   *
   * @param components defines an array with all the required components
   */
  protected requires(components: Type<Component>[]): void {
    for (const component of components) {
      if (!this.entity.getComponent(component)) {
        throw new Error(
          `${this.constructor.name} requires ${component.constructor.name}`,
        )
      }
    }
  }
}
