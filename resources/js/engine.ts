import { World } from 'ecsy';
import * as PIXI from 'pixi.js';
import { Application, IApplicationOptions, Sprite, Ticker } from 'pixi.js';
import { Position, Renderable, Velocity, Interactable } from './core/components';
import { RendererSystem, InteractableSystem } from './core/systems';
import { InputManager } from './core/managers/input-manager';
import { Camera } from './rendering/camera';
import { Map } from './utils/map';

export class Engine {
    public app: Application;
    public ticker: Ticker;
    public world: World;
    private map: Map;
    private mainCamera: Camera;
    private root: HTMLElement | null;
    private mouseTilePosition: PIXI.Text;

    constructor(options: IApplicationOptions) {
        this.app = new PIXI.Application(options);
        this.root = document.getElementById('root');
        this.ticker = PIXI.Ticker.shared;
        this.ticker.autoStart = false;
        this.world = new World();
        this.registerComponents([Position, Renderable, Velocity, Interactable]);
        this.registerSystems([RendererSystem, InteractableSystem]);
        this.root!.appendChild(this.app.view);
        this.mainCamera = new Camera(this.root!);
        this.handleEvents();
        this.map = new Map(this.app.renderer, this.mainCamera, {
            tilesPerXAxis: 80,
            tilesPerYAxis: 45,
            tileWidth: 32,
            tileHeight: 32,
            fillColor: 0xf0f0f0,
            outlineColor: 0xd9d9d9,
            isDragEnabled: true,
            isZoomEnabled: false,
        });

        this.app.stage.addChild(this.map);
        this.createPlayerEntity(this.map, { x: 768, y: 512 });

        this.mouseTilePosition = new PIXI.Text(
            'Position: (0, 0)',
            new PIXI.TextStyle({
                fill: '#d4d4d4',
                fontFamily: 'Verdana',
                fontWeight: 'bold',
                letterSpacing: 1,
                stroke: '#2f2f2f',
                strokeThickness: 2,
            })
        );

        this.app.stage.addChild(this.mouseTilePosition);
    }

    private handleEvents() {
        window.onresize = () => this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    public run() {
        this.ticker.start();

        this.ticker.add((delta) => {
            this.world.execute(delta, performance.now());
            InputManager.instance.update();
            this.map.update();
            this.mouseTilePosition.text = `Position: ${this.map.mouseTilePos.toString()}`;
        });
    }

    private registerComponents(components) {
        components.forEach((component) => {
            this.world.registerComponent(component);
        });
    }

    private registerSystems(systems) {
        systems.forEach((system) => {
            this.world.registerSystem(system);
        });
    }

    private createPlayerEntity(parent, position) {
        const sprite = this.getSprite(parent);

        this.world
            .createEntity()
            .addComponent(Velocity, { x: 5, y: 5 })
            .addComponent(Position, { x: position.x, y: position.y })
            .addComponent(Renderable, { sprite, width: sprite.width, height: sprite.height })
            .addComponent(Interactable);
    }

    private getSprite(parent) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x4073ff);
        graphics.drawRect(0, 0, 64, 64);
        graphics.endFill();
        const texture = this.app.renderer.generateTexture(graphics);
        const sprite = new Sprite(texture);
        parent.addChild(sprite);
        return sprite;
    }
}
