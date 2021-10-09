/**
 * Gets an element from the given array randomly.
 *
 * @param array An array that contains the element to be chosen.
 * @returns The chosen element.
 *
 * @example
 * getRandom([1, 2, 3, 4, 5]) => 4
 */
export function getRandom<T = Record<string, unknown>>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
