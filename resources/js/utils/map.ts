import { Vector2 } from './vector2';
import { Renderer } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { Camera } from '../rendering/camera';
import { AbstractRenderer, Container, Sprite, TilingSprite } from 'pixi.js';

export interface MapConfig {
    tilesPerXAxis: number;
    tilesPerYAxis: number;
    tileWidth: number;
    tileHeight: number;
    fillColor: number;
    outlineColor: number;
    isDragEnabled: boolean;
    isZoomEnabled: boolean;
}

export class Map extends Container {
    private camera: Camera;
    private config: MapConfig;
    private renderer: Renderer | AbstractRenderer;
    public mouseTilePos: Vector2;

    public get width() {
        return this.config.tileWidth * this.config.tilesPerXAxis;
    }

    public get height() {
        return this.config.tileHeight * this.config.tilesPerYAxis;
    }

    constructor(renderer: Renderer | AbstractRenderer, camera: Camera, config: MapConfig) {
        super();
        this.config = config;
        this.camera = camera;
        this.interactive = true;
        this.renderer = renderer;
        this.mouseTilePos = new Vector2();
        this.addChild(this.generateSprite());
        this.position.set(window.innerWidth / 2, window.innerHeight / 2);
    }

    private generateSprite(): Sprite {
        const graphics = new Graphics();
        const { tilesPerXAxis, tilesPerYAxis, tileWidth, tileHeight, fillColor, outlineColor } = this.config;
        graphics.lineStyle(1, outlineColor, 1, 0);
        graphics.beginFill(fillColor);
        graphics.drawRect(0, 0, tileWidth, tileHeight);
        graphics.endFill();

        const sprite = new TilingSprite(
            this.renderer.generateTexture(graphics),
            tilesPerXAxis * tileWidth,
            tilesPerYAxis * tileHeight
        );

        sprite.interactive = true;

        sprite.on('mousemove', (event) => {
            if (!event.target) return;

            const mousePosition = new Vector2().setFromObject(event.data.global);
            const worldPosition = this.camera.screenToWorldSpace(mousePosition);

            this.mouseTilePos.set(
                Math.floor(worldPosition.x / this.config.tileWidth),
                Math.floor(worldPosition.y / this.config.tileHeight)
            );
        });

        return sprite;
    }

    public update() {
        this.position.set(this.pivot.x - this.camera.offset.x, this.pivot.y - this.camera.offset.y);
    }
}
