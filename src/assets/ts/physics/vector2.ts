export class Vector2 {
  public get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  public constructor(public x = 0, public y = 0) {}

  public static distance(v1: Vector2, v2: Vector2): number {
    const x = v1.x - v2.x
    const y = v1.y - v2.y
    return Math.sqrt(x * x + y * y)
  }

  public static sum(...vectors: Vector2[]): Vector2 {
    return vectors.reduce(
      (previous, current) =>
        new Vector2(previous.x + current.x, previous.y + current.y),
    )
  }

  public static divide(dividend: Vector2, divider: number): Vector2 {
    return new Vector2(dividend.x / divider, dividend.y / divider)
  }
}
