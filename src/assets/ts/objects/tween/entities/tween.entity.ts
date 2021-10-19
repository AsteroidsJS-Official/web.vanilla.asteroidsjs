import { AbstractEntity, Entity, IOnAwake, IOnLoop } from '@asteroidsjs'

import { Tweener } from './tweener'

type TweenSetterFun<T> = (value: T) => void

@Entity()
export class Tween extends AbstractEntity implements IOnAwake, IOnLoop {
  private static _instance: Tween
  private static _tweeners: Tweener[]

  static to(
    getter: number,
    setter: TweenSetterFun<number>,
    endValue: number,
    duration: number,
  ): Tweener {
    const tweener = new Tweener(duration, endValue)
    this._tweeners.push(tweener)
    return tweener
  }

  onAwake(): void {
    if (!Tween._instance) {
      Tween._instance = this
      return
    }

    this.destroy(this)
  }

  onLoop(): void {
    for (const tweener of Tween._tweeners) {
      if (tweener.isStopped) {
        continue
      }

      if (tweener.progress >= tweener.duration) {
        Tween._tweeners = Tween._tweeners.filter((t) => t != tweener)
      }

      tweener.progress += this.deltaTime
    }
  }
}
