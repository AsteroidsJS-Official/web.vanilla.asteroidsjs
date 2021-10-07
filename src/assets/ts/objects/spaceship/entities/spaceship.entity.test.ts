import {
  Scene,
  AbstractScene,
  IAsteroidsApplication,
  AsteroidsFactory,
  Entity,
  AbstractEntity,
} from '@asteroidsjs'

import { Bullet } from '../../../objects/bullet/entities/bullet.entity'
import { Spaceship } from '../../../objects/spaceship/entities/spaceship.entity'

import { Health } from '../../../shared/components/health.component'

describe('rigidbody', () => {
  @Scene()
  class TestScene extends AbstractScene {}

  @Entity()
  class TestEntity extends AbstractEntity {}

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
