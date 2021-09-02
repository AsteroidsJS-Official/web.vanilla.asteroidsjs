import { abs, Component, IDraw, Vector2 } from '@asteroidsjs'

import { Rigidbody } from '../rigidbody.component'
import { Transform } from '../transform.component'
import { Collider2 } from './collider2.component'

/**
 * Class that represents a component that deals with collisions with
 * different entities
 *
 * A collider only interacts with entities that have the {@link Rigidbody}
 * component in order to make this behaviour more performatic
 */
@Component({
  required: [Transform, Rigidbody],
})
export class CircleCollider2 extends Collider2 implements IDraw {
  draw(): void {
    this.getContext().translate(
      this.transform.canvasPosition.x,
      this.transform.canvasPosition.y,
    )

    this.getContext().beginPath()
    this.getContext().fillStyle = '#05FF0020'
    this.game.getContext().arc(0, 0, this.dimensions.width / 2, 0, 2 * Math.PI)
    this.getContext().fill()

    this.getContext().translate(
      -this.transform.canvasPosition.x,
      -this.transform.canvasPosition.y,
    )
  }

  /**
   * Method that check if two transforms are colliding
   *
   * @param transform1 defines the first transform
   * @param transform defines the second transform
   * @returns true if the distance between their centers is sufficient to
   * consider the collision
   */
  protected isColliding(transform: Transform): boolean {
    return (
      // this.isCollidingWithCircle(transform) &&
      this.isCollidingWithRectangle(transform)
    )
  }

  private isCollidingWithCircle(transform2: Transform): boolean {
    return (
      Vector2.distance(this.position, transform2.position) <
      (this.dimensions.width + transform2.dimensions.width) / 2
    )
  }

  private isCollidingWithRectangle(transform: Transform): boolean {
    const diff = new Vector2(
      abs(this.position.x - transform.position.x),
      abs(this.position.y - transform.position.y),
    )

    if (diff.x > transform.dimensions.width / 2 + this.dimensions.width / 2) {
      return false
    }

    if (diff.y > transform.dimensions.height / 2 + this.dimensions.height / 2) {
      return false
    }

    if (diff.x <= transform.dimensions.width / 2) {
      return true
    }

    if (diff.y <= transform.dimensions.height / 2) {
      return true
    }

    const square =
      Math.pow(diff.x - transform.dimensions.width / 2, 2) +
      Math.pow(diff.y - transform.dimensions.height / 2, 2)

    return square <= Math.pow(this.dimensions.width / 2, 2)
  }
}

/**

bool intersects(CircleType circle, RectType rect)
{
    circleDistance.x = abs(circle.x - rect.x);
    circleDistance.y = abs(circle.y - rect.y);

    if (circleDistance.x > (rect.width/2 + circle.r)) { return false; }
    if (circleDistance.y > (rect.height/2 + circle.r)) { return false; }

    if (circleDistance.x <= (rect.width/2)) { return true; }
    if (circleDistance.y <= (rect.height/2)) { return true; }

    cornerDistance_sq = (circleDistance.x - rect.width/2)^2 +
                         (circleDistance.y - rect.height/2)^2;

    return (cornerDistance_sq <= (circle.r^2));
}

 */
