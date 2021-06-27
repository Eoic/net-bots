import { Renderer } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { TilingSprite } from 'pixi.js';

export class Grid {
  private _xTiles: number;
  private _yTiles: number;

  constructor(xTiles: number, yTiles: number) {
    this._xTiles = xTiles;
    this._yTiles = yTiles;
  }

  public generate(
    color: number,
    renderer: Renderer,
    tileWidth: number = 150,
    tileHeight: number = 150
  ): TilingSprite {
    const graphics = new Graphics();
    graphics.lineStyle(3, 0xd9d9d9, 1, 0);
    graphics.beginFill(color);
    graphics.drawRect(0, 0, tileWidth, tileHeight);
    graphics.endFill();
    const texture = renderer.generateTexture(graphics);
    return new TilingSprite(texture, this._xTiles * tileWidth, this._yTiles * tileHeight);
  }
}
