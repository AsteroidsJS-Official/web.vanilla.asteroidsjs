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
    
})
