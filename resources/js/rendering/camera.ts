import { Vector2 } from '../utils/vector2';

class Camera {
    public pivot: Vector2;
    public offset: Vector2;
    private target: HTMLElement;
    private isMouseHeld: boolean;
    private dragStartPosition: Vector2;

    constructor(target: HTMLElement) {
        this.isMouseHeld = false;
        this.pivot = new Vector2();
        this.offset = new Vector2();
        this.dragStartPosition = new Vector2();
        this.target = target;
        this.target.addEventListener('mousedown', (event: MouseEvent) => this.handleDragStart(event));
        this.target.addEventListener('mousemove', (event: MouseEvent) => this.handleDrag(event));
        this.target.addEventListener('mouseup', () => this.handleDragEnd());
        this.target.addEventListener('mouseleave', () => this.handleDragEnd());
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
}

export { Camera };
