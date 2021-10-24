import {
    AbstractEntity,
    AbstractScene,
    Entity,
    Scene,
    AsteroidsFactory,
    IAsteroidsApplication,
    Vector2,
    Rect,
  } from '@asteroidsjs'
  
  import { Transform } from '../shared/components/transform.component'
  
  describe('transform', () => {
    @Scene()
    class TestScene extends AbstractScene {}
  
    @Entity()
    class TestEntity extends AbstractEntity {}
  
    let app: IAsteroidsApplication
    let scene: TestScene
  
  })
  