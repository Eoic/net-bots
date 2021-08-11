import { Component, Types } from 'ecsy';

class BotController extends Component {}

BotController.schema = {
    speed: { type: Types.Number },
    isMoving: { type: Types.Boolean, default: false },
};

export { BotController };
