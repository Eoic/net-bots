export class Vector2 {
    private _x: number;
    private _y: number;

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }

    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    public set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setFromObject(object: any & { x: number; y: number }) {
        this.x = object.x;
        this.y = object.y;
        return this;
    }

    public dot(vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y;
    }

    public multiplyScalar(scalar: number): Vector2 {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    public divideScalar(scalar: number): Vector2 {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    public add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    public subtract(vector: Vector2): Vector2 {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    public length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public copy(vector: Vector2) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    public normalized() {
        const vectorLength = this.length();

        if (vectorLength === 0) {
            return new Vector2(0, 0);
        }

        return new Vector2(this.x / vectorLength, this.y / vectorLength);
    }

    public toString() {
        return `(${this.x}, ${this.y})`;
    }

    public equal(vector: Vector2, tolerance = 1e-4) {
        return Math.abs(this.x - vector.x) < tolerance || Math.abs(this.y - vector.y) < tolerance;
    }

    public static lerpNumber(start: number, end: number, step: number) {
        return start + (end - start) * step;
    }

    public static lerp(start: Vector2, end: Vector2, step: number) {
        return new Vector2(Vector2.lerpNumber(start.x, end.x, step), Vector2.lerpNumber(start.y, end.y, step));
    }
}
