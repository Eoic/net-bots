import { System } from 'ecsy';
import { Vector2 } from '../../utils/vector2';
import { Velocity, Position } from '../components';
import { InputManager } from '../managers/input-manager';

class MoveableSystem extends System {
  public execute(delta: number, _: number) {
    this.queries.moving.results.forEach((entity) => {
      const velocity: Velocity = entity.getMutableComponent(Velocity);
      const position: Position = entity.getMutableComponent(Position);

      if (!position || !velocity) {
        return;
      }

      let direction = new Vector2(
        InputManager.instance.getAxis('horizontal'),
        InputManager.instance.getAxis('vertical')
      );

      if (!direction.x && !direction.y) {
        return;
      }

      direction = direction.normalized();
      const deltaX = velocity.x * delta * direction.x;
      const deltaY = velocity.y * delta * direction.y;

      if (position.x + deltaX < 2400 - 50 && position.x + deltaX > 0) {
        position.x += deltaX;
      }

      if (position.y + deltaY < 1350 - 50 && position.y + deltaY > 0) {
        position.y += deltaY;
      }
    });
  }
}

MoveableSystem.queries = {
  moving: {
    components: [Velocity, Position],
  },
};

export { MoveableSystem };
