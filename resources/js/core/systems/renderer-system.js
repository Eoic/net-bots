import { System } from 'ecsy';
import { Position, Renderable } from '../components';

class RendererSystem extends System {
    execute(delta, time) {
        this.queries.renderables.results.forEach((entity) => {
            const renderable = entity.getComponent(Renderable);
            const position = entity.getComponent(Position);
            renderable.sprite.position.x = position.x;
            renderable.sprite.position.y = position.y;
        });
    }
}

RendererSystem.queries = {
    renderables: { components: [Renderable] },
};

export { RendererSystem };
