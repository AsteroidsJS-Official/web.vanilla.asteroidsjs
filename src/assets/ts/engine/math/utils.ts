/**
 * Function that, passed a number, returns it module or absolute value
 *
 * @param value defines the value that will be converted
 * @returns the value absolute value
 */
export function abs(value: number): number {
  return value < 0 ? -value : value
}
