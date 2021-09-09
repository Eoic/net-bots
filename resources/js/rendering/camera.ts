import { EventManager } from '../core/managers/event-manager';
import { Vector2 } from '../utils/vector2';

class Camera {
    private offset: Vector2;
    private panOrigin: Vector2;
    private isMouseHeld: boolean;

    constructor() {
        this.offset = new Vector2();
        this.panOrigin = new Vector2();
        this.isMouseHeld = false;
        EventManager.on('mousedown', (event) => this.handlePanStart(event));
        EventManager.on('mousemove', (event) => this.handlePan(event));
        EventManager.on('mouseup', () => this.handlePanEnd());
    }

    public worldToScreenSpace(worldPoint: Vector2): Vector2 {
        return worldPoint.subtract(this.offset);
    }

    public screenToWorldSpace(screenPoint: Vector2) {
        return screenPoint.add(this.offset);
    }

    public handlePanStart(event) {
        this.isMouseHeld = true;
        this.panOrigin.set(event.x, event.y);
    }

    public handlePan(event) {
        if (!this.isMouseHeld) {
            return;
        }

        const mousePosition = new Vector2(event.x, event.y);
        const positionChange = mousePosition.subtract(this.panOrigin);
        this.offset = this.offset.subtract(positionChange);
        this.panOrigin.copy(mousePosition);
    }

    public handlePanEnd() {
        this.isMouseHeld = false;
    }

    public update() {}
}

export { Camera };

/**
 * TODO: Add CameraController system to update object positions (instead of this).
 */
