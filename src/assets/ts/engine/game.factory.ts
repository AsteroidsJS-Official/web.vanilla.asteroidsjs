import { Game } from './core/game'
import { GameFactoryOptions } from './interfaces/game-factory-options.interface'

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
  public static create(options?: GameFactoryOptions): Game {
    const canvas = document.getElementById(
      'asteroidsjs-canvas',
    ) as HTMLCanvasElement

    canvas.width = options.width || window.innerWidth
    canvas.height = options.height || window.innerHeight

    const game = new Game()

    game.screenNumber = options.screenNumber
    game.context = canvas.getContext('2d')
    game.bootstrap.push(...options.bootstrap.map((entity) => new entity(game)))

    return game
  }
}
