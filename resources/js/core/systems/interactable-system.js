import { System } from 'ecsy';
import { Interactable, Renderable } from '../components';
import { Rectangle } from 'pixi.js';

class InteractableSystem extends System {
    execute(delta, time) {
        this.queries.interactables.added.forEach((entity) => {
            console.log('Adding events to player sprite.');
            const renderable = entity.getComponent(Renderable);
            const sprite = renderable.sprite;
            sprite.interactive = true;
            sprite.hitArea = new Rectangle(0, 0, 64, 64);

            sprite.on('mouseover', (_) => {
                sprite.tint = 0x2f2f2f;
            });

            sprite.on('mouseout', (_) => {
                sprite.tint = 0xffffff;
            });
        });
    }
}

InteractableSystem.queries = {
    interactables: {
        components: [Interactable, Renderable],
        listen: {
            added: true,
            removed: true,
        },
    },
};

export { InteractableSystem };
