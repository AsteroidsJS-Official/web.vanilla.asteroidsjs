import {
  AbstractComponent,
  AbstractEntity,
  AbstractScene,
  AbstractService,
  AsteroidsFactory,
  Component,
  Entity,
  IAsteroidsApplication,
  Scene,
  Service,
} from '@asteroidsjs'

describe('app', () => {
  @Scene()
  class TestScene extends AbstractScene {}

  @Entity()
  class TestEntity extends AbstractEntity {}

  @Component()
  class TestComponent extends AbstractComponent {}

  @Service()
  class TestService extends AbstractService {}

  let app: IAsteroidsApplication
  let scene: TestScene

  beforeAll(() => {
    app = AsteroidsFactory.create({
      bootstrap: [TestScene],
    })
    app.start()
    scene = app.getScene(TestScene)
    scene.createCanvas({ name: 'test' })
  })

  it('should be defined', () => {
    expect(app.getScene(TestScene)).toBeDefined()
  })

  it('should instantiate an entity', () => {
    const entity = scene.instantiate({ entity: TestEntity })
    expect(entity).toBeDefined()
  })

})