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
    class TestScene extends AbstractScene { }

    @Entity()
    class TestEntity extends AbstractEntity { }

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
        const entity = scene.instantiate({
            entity: TestEntity,
            components: [Transform],
        })

        const component = entity.getComponent(Transform)
        expect(component).toBeDefined()
    })

    it('should move with parent', () => {
        const parent = scene.instantiate({
          entity: TestEntity,
          components: [Transform],
        })
        const child = scene.instantiate({
          entity: TestEntity,
          components: [Transform],
        })
    
        const parentTransform = parent.getComponent(Transform)
        const childTransform = child.getComponent(Transform)
        const initialPosition = childTransform.position.clone()
    
        childTransform.parent = parentTransform
    
        parentTransform.position = Vector2.sum(
          parentTransform.position,
          new Vector2(2, 2),
        )
    
        expect(childTransform.position.x).toBe(initialPosition.x + 2)
        expect(childTransform.position.y).toBe(initialPosition.y + 2)
      })
    

      it('should rotate with parent', () => {
        const parent = scene.instantiate({
          entity: TestEntity,
          components: [Transform],
        })
        const child = scene.instantiate({
          entity: TestEntity,
          components: [Transform],
        })
    
        const parentTransform = parent.getComponent(Transform)
        const childTransform = child.getComponent(Transform)
        const initialRotation = childTransform.rotation
    
        childTransform.parent = parentTransform
    
        parentTransform.rotation += Math.PI
        expect(childTransform.rotation).not.toBe(initialRotation)
      })

      

})
