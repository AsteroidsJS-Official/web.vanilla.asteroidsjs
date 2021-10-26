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

/**
 * Gets an element from the given array according to its weight.
 *
 * @param array An array that contains elements and their weights.
 * @param weightProp The name of the property that contains the element weight.
 * @returns The chosen element.
 *
 * @example
 * getRandomWithWeight(
 *   [
 *     { value: 1, weight: 0.1 },
 *     { value: 2, weight: 0.3 },
 *     { value: 3, weight: 0.6 },
 *   ],
 *   'weight',
 * )
 */
export function getRandomWithWeight<T = Record<string, unknown>>(
  array: T[],
  weightProp: string,
): T {
  const weights: number[] = []
  let item: T

  for (let i = 0; i < array.length; i++) {
    const weight = (array[i] as any)[weightProp] as number
    weights[i] = weight + (weights[i - 1] || 0)
  }

  const random = Math.random() * weights[weights.length - 1]

  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > random) {
      item = array[i]
      break
    }
  }

  return item
}
