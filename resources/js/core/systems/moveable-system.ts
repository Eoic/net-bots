import { System } from 'ecsy';
import { Vector2 } from '../../utils/vector2';
import { Velocity, Position, Renderable, BotController } from '../components';
import { InputManager } from '../managers/input-manager';

class MoveableSystem extends System {
    private positionRoundingMethod = new Map([
        [-1, Math.floor],
        [0, Math.round],
        [1, Math.ceil],
    ]);

    public execute(delta: number, _: number) {
        this.queries.moving.results.forEach((entity) => {
            const velocity: Velocity = entity.getMutableComponent(Velocity);
            const position: Position = entity.getMutableComponent(Position);
            const renderable: Renderable = entity.getComponent(Renderable);
            const botController: BotController = entity.getMutableComponent(BotController);
            const width = renderable.width;
            const height = renderable.height;
            const speed = botController.speed;
            // const parent = renderable.sprite.parent;

            if (!position || !velocity) {
                return;
            }

            const direction = new Vector2(
                InputManager.instance.getAxis('horizontal'),
                InputManager.instance.getAxis('vertical')
            );

            const lastValidX = this.positionRoundingMethod.get(direction.x)!(position.x / width) * width;
            const lastValidY = this.positionRoundingMethod.get(direction.y)!(position.y / height) * height;
            const target = new Vector2(lastValidX + width * direction.x, lastValidY + height * direction.y);
            let newPosition = Vector2.lerp(position, target, delta * speed);
            position.x = newPosition.x;
            position.y = newPosition.y;

            // direction = direction.normalized();
            // const deltaX = velocity.x * delta * direction.x;
            // const deltaY = velocity.y * delta * direction.y;

            // if (position.x + deltaX < parent.width - renderable.sprite.width && position.x + deltaX > 0) {
            //     position.x += deltaX;
            // }

            // if (position.y + deltaY < parent.height - renderable.sprite.height && position.y + deltaY > 0) {
            //     position.y += deltaY;
            // }
        });
    }
}

MoveableSystem.queries = {
    moving: {
        components: [Velocity, Position],
    },
};

export { MoveableSystem };
