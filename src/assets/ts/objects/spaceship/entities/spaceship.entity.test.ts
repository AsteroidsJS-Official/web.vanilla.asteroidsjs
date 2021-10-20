import {
  Scene,
  AbstractScene,
  IAsteroidsApplication,
  AsteroidsFactory,
} from '@asteroidsjs'

<<<<<<< HEAD
import { Bullet } from '../../bullet/entities/bullet.entity'
import { Spaceship } from './spaceship.entity'
=======
import { Bullet } from '../../../objects/bullet/entities/bullet.entity'
import { Spaceship } from '../../../objects/spaceship/entities/spaceship.entity'
>>>>>>> fe6f30d2d2a8c2edf4dc0f5421ba3bb24acc3089

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

<<<<<<< HEAD
    entity.removeTags('intangible')

=======
>>>>>>> fe6f30d2d2a8c2edf4dc0f5421ba3bb24acc3089
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
