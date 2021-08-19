import { Entity } from './entities/entity'

export class GameFactory {
  public static context: CanvasRenderingContext2D
  private static entities: Entity[] = []

  public static setup(): void {
    const canvas = document.getElementById(
      'asteroidsjs-canvas',
    ) as HTMLCanvasElement

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.context = canvas.getContext('2d')

    setInterval(() => {
      this.context.clearRect(0, 0, canvas.width, canvas.height)
      for (const entity of this.entities) {
        entity.loop()
        entity.draw()
      }
    }, 20)
  }

  public static registerEntity(entity: Entity): void {
    this.entities.push(entity)
  }
}
