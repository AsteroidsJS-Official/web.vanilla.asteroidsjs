import {
  Scene,
  AbstractScene,
  IAsteroidsApplication,
  AsteroidsFactory,
  Entity,
  AbstractEntity,
  Vector2,
} from '@asteroidsjs'

import { Transform } from '../shared/components/transform.component'
import { Rigidbody } from '../shared/components/rigidbody/rigidbody.component'
import { delay } from '../utils/delay'

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
  })

  it('should be defined', () => {
    scene.createCanvas({
      name: 'test',
    })

    const entity = scene.instantiate({
      entity: TestEntity,
      components: [Transform, Rigidbody],
    })

    const component = entity.getComponent(Rigidbody)
    expect(component).toBeDefined()
  })

  it('should be moving', async () => {
    const entity = scene.instantiate({
      entity: TestEntity,
      components: [Transform, Rigidbody],
    })

    const rigidbody = entity.getComponent(Rigidbody)
    const transform = entity.getComponent(Transform)

    const initialPosition = transform.position.clone()
    rigidbody.velocity = new Vector2(1, 0)

    await delay(1000)

    expect(transform.position.x).not.toBe(initialPosition.x)
  })
  
})
