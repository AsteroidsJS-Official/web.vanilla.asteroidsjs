import {
  AbstractComponent,
  AbstractEntity,
  clamp,
  Component,
  Entity,
  IOnAwake,
  IOnDestroy,
  IOnLoop,
  isOverflowingX,
  Vector2,
} from '@asteroidsjs'

import { LGSocketService } from '../services/lg-socket.service'

import { Transform } from './transform.component'

import { Howl } from 'howler'
import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Component responsible for creating controlling audio sources.
 */
@Component({
  required: [Transform],
  services: [LGSocketService],
})
export class AudioSource
  extends AbstractComponent
  implements IOnAwake, IOnDestroy, IOnLoop
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
   * clip or an url.
   */
  clip: string

  /**
   * Property that defines whether the audio will play on loop.
   */
  loop: boolean

  /**
   * Property that defines whether the audio is playing.
   */
  playing: boolean

  private _lgSocketService: LGSocketService

  /**
   * Property that defines an object that represents the audio controller
   * object.
   */
  private _howl: Howl

  /**
   * Property that defines an object that represents the entity transform
   * component.
   */
  private _transform: Transform

  /**
   * Property that defines whether the audio has already ended.
   */
  private _finished = new BehaviorSubject<boolean>(false)

  /**
   * Property that defines an observable that is triggered when the
   * '_finished' property changes its value.
   */
  public get finished$(): Observable<boolean> {
    return this._finished.asObservable()
  }

  onAwake(): void {
    this._lgSocketService = this.getService(LGSocketService)

    this._transform = this.getComponent(Transform)
  }

  onDestroy(): void {
    this._howl?.stop()
  }

  onLoop(): void {
    if (
      this._lgSocketService.screen &&
      this._lgSocketService.screen.number !== 1
    ) {
      return
    }

    if (this._howl && this._howl.rate() !== this.timeScale) {
      this._howl.rate(this.timeScale)
    }

    if (this._howl && this.spatial) {
      if (
        isOverflowingX(
          this.getContexts()[0].canvas.width,
          this._transform.position.x,
          this._transform.dimensions.width,
        )
      ) {
        this._howl.stereo(0)
      } else {
        this._howl.stereo(this.getStereoBias())
      }
    }
  }

  /**
   * Method that plays some sound related with this related entity.
   *
   * When the entity or this component is destroyed the audio stops.
   *
   * @param clip defines a string that represents the audio clip that will
   * be executed.
   * @param volume defines a number that represents the audio volume.
   */
  play(clip?: string, volume?: number): void {
    if (
      this._lgSocketService.screen &&
      this._lgSocketService.screen.number !== 1
    ) {
      return
    }

    this.clip ??= clip

    this._howl = new Howl({
      src: this.clip,
      loop: this.loop,
      rate: this.timeScale,
      volume: volume || this.volume,
      onend: () => {
        this.playing = this.loop
        this._finished.next(true)
      },
    })

    this.playing = true
    this._howl.play()
  }

  /**
   * Method that plays some audio once, regardless the object is active or
   * destroyed.
   *
   * @param clip The path to the audio source.
   * @param position The entity current position.
   * @param volume The audio volume.
   */
  playOneShot(clip: string, position?: Vector2, volume = 1): void {
    if (
      this._lgSocketService.screen &&
      this._lgSocketService.screen.number !== 1
    ) {
      return
    }

    // FIXME: remove class
    @Entity()
    class DefaultEntity extends AbstractEntity {}

    const audioSource = this.instantiate({
      entity: DefaultEntity,
      components: [
        {
          class: Transform,
          use: {
            position: position || new Vector2(0, 0),
          },
        },
        {
          class: AudioSource,
          use: {
            clip,
            volume,
            spatial: !!position,
          },
        },
      ],
    })

    audioSource.getComponent(AudioSource).play()

    audioSource.getComponent(AudioSource).finished$.subscribe((value) => {
      if (value) {
        this.destroy(audioSource)
      }
    })
  }

  /**
   * Method that stops the current audio.
   */
  stop(): void {
    this.playing = false
    this._howl?.stop()
  }

  /**
   * Method that pauses the current audio.
   */
  pause(): void {
    this.playing = false
    this._howl?.pause()
  }

  /**
   * Method that calculates the audio source bias.
   *
   * @returns the calculated bias value.
   */
  private getStereoBias(): number {
    const width = this.getContexts()[0].canvas.width
    const bias =
      -(
        (Math.round(width / 2) - (width / 2 + this._transform.position.x)) /
        width
      ) * 2
    return clamp(bias, -1, 1)
  }
}
