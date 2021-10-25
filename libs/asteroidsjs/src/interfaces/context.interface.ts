/**
 * Interface that represents the game context
 */
export type IContext = CanvasRenderingContext2D & {
  mode?: CanvasRenderingMode
}
export type CanvasRenderingMode = 'clear' | 'normal'
