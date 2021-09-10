import { Vector2 } from '../utils/vector2';
import { EventManager } from '../core/managers/event-manager';

class Camera {
    public pivot: Vector2;
    public offset: Vector2;
    public scale: number = 1;
    private isMouseHeld: boolean;
    private dragStartPosition: Vector2;

    constructor() {
        this.isMouseHeld = false;
        this.pivot = new Vector2();
        this.offset = new Vector2();
        this.dragStartPosition = new Vector2();
        EventManager.on('mousedown', (event: MouseEvent) => this.handleDragStart(event));
        EventManager.on('mousemove', (event: MouseEvent) => this.handleDrag(event));
        EventManager.on('mouseup', () => this.handleDragEnd());
        EventManager.on('wheel', (event) => this.handleZoom(event));
    }

    public worldToScreenSpace(worldPoint: Vector2): Vector2 {
        return worldPoint.subtract(this.offset);
    }

    public screenToWorldSpace(screenPoint: Vector2): Vector2 {
        return screenPoint.add(this.offset);
    }

    public handleDragStart(event: MouseEvent) {
        this.isMouseHeld = true;
        this.dragStartPosition.set(event.x, event.y);
    }

    public handleDrag(event: MouseEvent) {
        if (!this.isMouseHeld) return;

        const mousePosition = new Vector2(event.x, event.y);
        const positionChange = mousePosition.subtract(this.dragStartPosition);
        this.offset = this.offset.subtract(positionChange);
        this.dragStartPosition.copy(mousePosition);
    }

    public handleDragEnd() {
        this.isMouseHeld = false;
    }

    public handleZoom(_event) {
        // if (event.deltaY > 0) this.scale *= 0.99;
        // else if (event.deltaY < 0) this.scale *= 1.01;
        // this.pivot.copy(this.screenToWorldSpace(new Vector2(event.clientX * this.scale, event.clientY * this.scale)));
    }
}

export { Camera };
