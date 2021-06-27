import { Component, Types } from 'ecsy';

class Renderable extends Component {}

Renderable.schema = {
  sprite: { type: Types.Ref },
};

export { Renderable };
