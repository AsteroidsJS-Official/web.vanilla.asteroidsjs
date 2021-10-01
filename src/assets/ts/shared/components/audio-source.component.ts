import {
  AbstractComponent,
  Component,
  IOnAwake,
  IOnDestroy,
} from '@asteroidsjs'

import { Transform } from './transform.component'

import { Howl } from 'howler'

/**
 * Component responsible for creating controlling audio sources.
 */
@Component({
  required: [Transform],
})
export class AudioSource
  extends AbstractComponent
  implements IOnAwake, IOnDestroy
{
  /**
   * Property that defines a boolean value responsible for saying if the
   * audio must be executed in the spatial mode.
   */
  spatial: boolean

  /**
   * Property that defines the audio source volume.
   */
  volume: number

  /**
   * Property that defines a string value that can be a path to the audio
   * clip or an url;
   */
  clip: string

  /**
   * Property that defines an object that represents the audio controller
   * object.
   */
  private howl: Howl

  /**
   * Property that defines an object that represents the entity transform
   * component.
   */
  private transform: Transform

  onAwake(): void {
    this.transform = this.getComponent(Transform)
  }

  onDestroy(): void {
    this.howl.stop()
  }

  /**
   * Method that plays some sound related with this related entity.
   *
   * When the entity or this component is destroyed the audio stops.
   *
   * @param clip defines a string that represents the audio clip that will
   * be executed.
   */
  play(clip?: string): void {
    this.clip ??= clip

    this.howl = new Howl({
      src: this.clip,
    })

    if (this.spatial) {
      this.howl.stereo(this.getStereoBias())
    }

    this.howl.play()
  }

  /**
   * Method that plays some audio once, regardless the object is active or
   * destroyed.
   */
  playOneShot(clip: string): void {
    const howl = new Howl({
      src: clip,
    })

    console.log(this.spatial)
    if (this.spatial) {
      howl.stereo(this.getStereoBias())
    }

    howl.play()
  }

  /**
   * Method that stops the current audio.
   */
  stop(): void {
    this.howl.stop()
  }

  /**
   * Method that pauses the current audio.
   */
  pause(): void {
    this.howl.pause()
  }

  /**
   * Method that calculates the audio source bias.
   *
   * @returns the calculated bias value.
   */
  private getStereoBias(): number {
    const width = this.getContexts()[0].canvas.width
    const bias =
      -((Math.round(width / 2) - this.transform.canvasPosition.x) / width) * 2
    return bias
  }
}
