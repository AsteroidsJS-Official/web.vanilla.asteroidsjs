import { Vector2 } from '.'

/**
 * Function that, passed a number, returns it module or absolute value
 *
 * @param value defines the value that will be converted
 * @returns the value absolute value
 */
export function abs(value: number): number {
  return value < 0 ? -value : value
}

/**
 * Function that, passed an angle, returns a vector based on that angle
 *
 * @param angle defines the vector angle
 * @returns the calculated vector
 */
export function angleToVector2(angle: number): Vector2 {
  return new Vector2(Math.cos(angle), Math.sin(angle))
}

/**
 * Function that, passed the a vector, returns it angle using the whole
 * trigonometry circle
 *
 * @param vector defines an objecto that represents the vector
 * @returns a number that represent the vector angle
 */
export function vector2ToAngle(vector: Vector2): number {
  const normalized = vector.normalized
  const value = Math.atan2(normalized.y, normalized.x)
  return value < 0 ? 2 * Math.PI + value : value
}
