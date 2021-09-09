/* eslint-disable prettier/prettier */
import { Renderer } from '@pixi/core';
import { Graphics } from '@pixi/graphics';
import { AbstractRenderer, Container, Sprite, TilingSprite } from 'pixi.js';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_SCALE } from './constants';
import { MathUtils } from './math-utils';

export interface GridConfig {
    tilesPerXAxis: number;
    tilesPerYAxis: number;
    tileWidth: number;
    tileHeight: number;
    fillColor: number;
    outlineColor: number;
    isDragEnabled: boolean;
    isZoomEnabled: boolean;
}

export class Grid extends Container {
    private renderer: Renderer | AbstractRenderer;
    private config: GridConfig;
    private isDragged: boolean;
    private isZoomAvailable: boolean;

    public get width() {
        return this.config.tileWidth * this.config.tilesPerXAxis;
    }

    public get height() {
        return this.config.tileHeight * this.config.tilesPerYAxis;
    }

    constructor(renderer: Renderer | AbstractRenderer, config: GridConfig) {
        super();
        this.renderer = renderer;
        this.config = config;
        this.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this.addChild(this.generateSprite());
        this.bindEvents();
    }

    private generateSprite(): Sprite {
        const graphics = new Graphics();
        const { tilesPerXAxis, tilesPerYAxis, tileWidth, tileHeight, fillColor, outlineColor } = this.config;
        graphics.lineStyle(1, outlineColor, 1, 0);
        graphics.beginFill(fillColor);
        graphics.drawRect(0, 0, tileWidth, tileHeight);
        graphics.endFill();

        return new TilingSprite(
            this.renderer.generateTexture(graphics),
            tilesPerXAxis * tileWidth,
            tilesPerYAxis * tileHeight
        );
    }

    private bindEvents() {
        this.interactive = true;
        this.pivot.set(
            (this.config.tilesPerXAxis * this.config.tileWidth * this.scale.x) / 2,
            (this.config.tilesPerYAxis * this.config.tileHeight * this.scale.y) / 2
        );

        this.on('mousedown', () => {
            if (!this.config.isDragEnabled)
                return;

            this.isDragged = true;
            document.body.style.cursor = 'grab';
        });

        this.on('mouseup', () => {
            if (!this.config.isDragEnabled)
                return;

            this.isDragged = false;
            document.body.style.cursor = 'default';
        });

        this.on('mousemove', (event) => {
            if (!this.config.isDragEnabled)
                return;

            if (this.isDragged) {
                this.position.x += event.data.originalEvent.movementX;
                this.position.y += event.data.originalEvent.movementY;;
            }
        });

        // eslint-disable-next-line prettier/prettier
        window.addEventListener('wheel', (event) => {
            if (!this.config.isZoomEnabled)
                return;

            if (this.isZoomAvailable) {
                if (event.deltaY > 0) {
                    this.scale.x = MathUtils.clamp(this.scale.x * ZOOM_SCALE, MIN_ZOOM, MAX_ZOOM);
                    this.scale.y = MathUtils.clamp(this.scale.x * ZOOM_SCALE, MIN_ZOOM, MAX_ZOOM);
                } else {
                    this.scale.x = MathUtils.clamp(this.scale.x / ZOOM_SCALE, MIN_ZOOM, MAX_ZOOM);
                    this.scale.y = MathUtils.clamp(this.scale.x / ZOOM_SCALE, MIN_ZOOM, MAX_ZOOM);
                }
            }
        }, { passive: true, capture: true });

        this.on('mouseover', () => {
            this.isZoomAvailable = true;
        });

        this.on('mouseout', () => {
            this.isZoomAvailable = false;
        });
    }
}
