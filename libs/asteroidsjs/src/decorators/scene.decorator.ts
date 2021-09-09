import { ISceneOptions } from '../interfaces/scene-options.interface'

import { SCENE_OPTIONS } from '../constants'

/**
 * Decorator that marks a class as {@link Scene}
 *
 * A scene represents an object in the game that handles entities. A
 * scene must be marked with `@Scene` and extends `AbstractScene` to
 * work as expected.
 *
 * Scenes are allowed to use only the `onStart` and `onDestroy` methods
 *
 * @see {@link IOnStart}
 * @see {@link IOnDestroy}
 *
 * @param options defines and object that contains all the scene
 * options and dependencies
 */
export function Scene(options?: ISceneOptions): ClassDecorator {
  options ??= {}

  return (target) => {
    Reflect.defineMetadata(SCENE_OPTIONS, options, target)
  }
}
