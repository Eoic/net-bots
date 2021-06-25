import { System } from 'ecsy';
import { Vector2 } from '../../utils/vector2';
import { Velocity, Position } from '../components';
import { InputManager, Keys } from '../managers/input-manager';

class MoveableSystem extends System {
  public execute(delta: number, _: number) {
    this.queries.moving.results.forEach((entity) => {
      const velocity: Velocity = entity.getMutableComponent(Velocity);
      const position: Position = entity.getMutableComponent(Position);

      if (!position || !velocity) {
        return;
      }

      let direction = new Vector2();

      if (InputManager.instance.getKey(Keys.W)) {
        direction.y += 1;
      }
      if (InputManager.instance.getKey(Keys.S)) {
        direction.y -= 1;
      }
      if (InputManager.instance.getKey(Keys.A)) {
        direction.x -= 1;
      }
      if (InputManager.instance.getKey(Keys.D)) {
        direction.x += 1;
      }

      direction = direction.normalized();
      position.x += velocity.x * delta * direction.x;
      position.y += velocity.y * delta * direction.y;
    });
  }
}

MoveableSystem.queries = {
  moving: {
    components: [Velocity, Position],
  },
};

export { MoveableSystem };
