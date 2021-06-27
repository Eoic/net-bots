import { System } from 'ecsy';
import { Position, Renderable } from '../components';

class DebugSystem extends System {
  execute(delta, time) {
    console.log(delta);
  }
}

DebugSystem.queries = {};

export { DebugSystem };
