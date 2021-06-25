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

  public dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  public multiplyScalar(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public subtract(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  public length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalized() {
    const vectorLength = this.length();

    if (vectorLength === 0) {
      return new Vector2(0, 0);
    }

    return new Vector2(this.x / vectorLength, this.y / vectorLength);
  }
}
