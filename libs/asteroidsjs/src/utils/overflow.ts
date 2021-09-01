/**
 * Calculates if the entity is overflowing the canvas horizontally.
 *
 * @param canvasWidth The canvas width.
 * @param x The entity X position.
 * @param width The entity total width.
 * @returns Whether the entity is overflowing the canvas horizontally.
 */
export function isOverflowingX(
  canvasWidth: number,
  x: number,
  width: number,
): boolean {
  const leftEdge = canvasWidth / 2 - x - width / 2

  const rightEdge = canvasWidth / 2 - x + width / 2

  return leftEdge < 0 || rightEdge > canvasWidth
}

/**
 * Calculates if the entity is overflowing the canvas vertically.
 *
 * @param canvasHeight The canvas height.
 * @param y The entity Y position.
 * @param height The entity total height.
 * @returns Whether the entity is overflowing the canvas vertically.
 */
export function isOverflowingY(
  canvasHeight: number,
  y: number,
  height: number,
): boolean {
  const topEdge = canvasHeight / 2 - y - height / 2

  const bottomEdge = canvasHeight / 2 - y + height / 2

  return topEdge < 0 || bottomEdge > canvasHeight
}
