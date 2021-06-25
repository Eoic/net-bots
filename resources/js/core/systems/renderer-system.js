import { System, Types } from 'ecsy';
import { Graphics } from 'pixi.js';
import { Position, Renderable, Shape } from '../components';

class RendererSystem extends System {
  execute(delta, time) {
    this.queries.renderables.results.forEach((entity) => {
      const shape = entity.getComponent(Shape);
      const position = entity.getComponent(Position);
      shape.sprite.position.x = position.x;
      shape.sprite.position.y = position.y;
    });
  }
}

RendererSystem.queries = {
  renderables: { components: [Renderable, Shape] },
};

export { RendererSystem };
