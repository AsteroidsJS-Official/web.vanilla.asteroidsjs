/**
 * Class that represents some rect, used to set dimensions to entities
 */
export class Rect {
  /**
   * Property that defines the rect area
   */
  public get area(): number {
    return this.width * this.height
  }

  public constructor(public width = 1, public height = 1) {}
}
