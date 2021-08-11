import { Component, Types } from 'ecsy';

class Renderable extends Component {}

Renderable.schema = {
    sprite: { type: Types.Ref },
    width: { type: Types.Number },
    height: { type: Types.Number },
};

export { Renderable };
