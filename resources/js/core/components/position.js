import { Component, Types } from 'ecsy';

class Position extends Component {}

Position.schema = {
    x: { type: Types.Number },
    y: { type: Types.Number },
};

export { Position };
