/**
 * Class that represents some service in the game
 */
export abstract class AbstractProvider {
  public constructor(public providers: AbstractProvider[] = []) {}
}
