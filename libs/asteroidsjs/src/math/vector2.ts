/**
 * Class that represents a vector with two dimensions
 *
 * This can be used to represents forces, velocity, position and
 * dimensions or some entity
 *
 * @example
 * ```ts
 * const vector = new Vector2(1, 1)
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics)
 */
export class Vector2 {
  /**
   * Property that returns the module of the vector
   */
  public get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  /**
   * Property that returns a vector with the same direction but with
   * magnitude 1
   *
   * @example
   * const vector = new Vector2(2, 2) // { x: 3, y: 4 }
   * const normalizedVector = vector.nomalized // { x: 0.6, y: 0.8 }
   */
  public get normalized(): Vector2 {
    if (!this.magnitude) {
      return new Vector2(0, 0)
    }
    return new Vector2(this.x / this.magnitude, this.y / this.magnitude)
  }

  public constructor(public x = 0, public y = 0) {}

  /**
   * Method that calculates the distance between two vectors using
   * `Euclidean distance`
   *
   * @param v1 defines the first vector
   * @param v2 defines the second vector
   * @returns a number that represents the distance between them both
   *
   * @see https://en.wikipedia.org/wiki/Euclidean_distance
   */
  public static distance(v1: Vector2, v2: Vector2): number {
    const x = v1.x - v2.x
    const y = v1.y - v2.y
    return Math.sqrt(x * x + y * y)
  }

  /**
   * Method that sums all the vectors from the array using
   *
   * @param vectors defines an array of vectors that will be summed
   * @returns a vector that represet the sum of all the others
   */
  public static sum(...vectors: Vector2[]): Vector2 {
    return vectors.reduce(
      (previous, current) =>
        new Vector2(previous.x + current.x, previous.y + current.y),
    )
  }

  /**
   * Method that multiplies the vector for the number
   *
   * @param factor defines the vector that will be mutiplied
   * @param factor defines a number that represents the mutiplier
   * @returns the vector multiplied for the number
   *
   * @example
   * (2, 4) * 2 = (4, 8)
   */
  public static multiply(factor: Vector2, value: number): Vector2 {
    return new Vector2(factor.x * value, factor.y * value)
  }
}
