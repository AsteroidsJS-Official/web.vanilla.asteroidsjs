import {
  Scene,
  AbstractScene,
  IAsteroidsApplication,
  AsteroidsFactory,
} from '@asteroidsjs'

import { Bullet } from '../../bullet/entities/bullet.entity'
import { Spaceship } from './spaceship.entity'

describe('rigidbody', () => {
  @Scene()
  class TestScene extends AbstractScene {}

  let app: IAsteroidsApplication
  let scene: TestScene

  beforeAll(() => {
    app = AsteroidsFactory.create({
      bootstrap: [TestScene],
    })
    app.start()
    scene = app.getScene(TestScene)
    scene.createCanvas({
      name: 'test',
    })
  })

  it('he must shoot', () => {
    const entity = scene.instantiate({
      entity: Spaceship,
    })

    entity.removeTags('intangible')

    let bullets = scene.entities.filter(
      (e) => e.constructor.name === Bullet.name,
    )

    expect(bullets.length).toBe(0)

    entity.shoot()
    bullets = scene.entities.filter((e) => e.constructor.name === Bullet.name)

    expect(bullets).toBeDefined()
    expect(bullets.length).toBeGreaterThan(0)
  })
})
