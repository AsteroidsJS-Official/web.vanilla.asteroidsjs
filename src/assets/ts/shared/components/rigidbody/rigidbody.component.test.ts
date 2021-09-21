import {
  Scene,
  AbstractScene,
  IAsteroidsApplication,
  AsteroidsFactory,
  Entity,
  AbstractEntity,
} from '@asteroidsjs'

import { Transform } from '../transform.component'
import { Rigidbody } from './rigidbody.component'

describe('rigidbody', () => {
  @Scene()
  class TestScene extends AbstractScene {}

  @Entity()
  class TestEntity extends AbstractEntity {}

  let scene: TestScene
  let app: IAsteroidsApplication

  beforeAll(() => {
    app = AsteroidsFactory.create({ bootstrap: [TestScene] })
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
})
