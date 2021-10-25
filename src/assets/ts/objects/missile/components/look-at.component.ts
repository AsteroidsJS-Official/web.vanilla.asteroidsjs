import {
  AbstractComponent,
  Component,
  IOnAwake,
  IOnLateLoop,
  Vector2,
  vector2ToAngle,
} from '@asteroidsjs'

import { Transform } from '../../../shared/components/transform.component'

/**
 * Component that makes the entity keep looking at some target transform.
 */
@Component({
  required: [Transform],
})
export class LookAt extends AbstractComponent implements IOnAwake, IOnLateLoop {
  /**
   * Property that represents the target transform that will be looked at.
   */
  target: Transform

  /**
   * Property that represents the entity transform.
   */
  private _transform: Transform

  onAwake(): void {
    this._transform = this.getComponent(Transform)
  }

  onLateLoop(): void {
    const direction = Vector2.sum(
      this._transform.position,
      Vector2.multiply(this.target.position, -1),
    ).normalized

    this._transform.rotation = (vector2ToAngle(direction) + Math.PI / 2) * -1
  }
}
