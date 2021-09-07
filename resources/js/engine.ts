import { World } from 'ecsy';
import * as PIXI from 'pixi.js';
import { Application, IApplicationOptions, Sprite, Ticker } from 'pixi.js';
import { Position, Renderable, Velocity, Interactable, BotController } from './core/components';
import { MoveableSystem, RendererSystem, InteractableSystem } from './core/systems';
import { InputManager, Keys } from './core/managers/input-manager';
import { Grid } from './utils/grid';

export class Engine {
    public app: Application;
    public ticker: Ticker;
    public world: World;
    private grid: Grid;

    constructor(options: IApplicationOptions) {
        this.app = new PIXI.Application(options);
        this.ticker = PIXI.Ticker.shared;
        this.ticker.autoStart = false;
        this.world = new World();
        this.handleEvents();
        this.registerComponents([Position, Renderable, Velocity, Interactable, BotController]);
        this.registerSystems([MoveableSystem, RendererSystem, InteractableSystem]);
        this.grid = new Grid(this.app.renderer, {
            tilesPerXAxis: 64,
            tilesPerYAxis: 64,
            tileWidth: 64,
            tileHeight: 64,
            fillColor: 0xf0f0f0,
            outlineColor: 0xd9d9d9,
            isDragEnabled: true,
            isZoomEnabled: false,
        });

        this.app.stage.addChild(this.grid);
        this.createPlayerEntity(this.grid, { x: 768, y: 512 });
        InputManager.instance.addKey(Keys.W);
        InputManager.instance.addKey(Keys.A);
        InputManager.instance.addKey(Keys.S);
        InputManager.instance.addKey(Keys.D);
        document.getElementById('root')?.appendChild(this.app.view);
    }

    private handleEvents() {
        window.onresize = () => this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    public run() {
        this.ticker.start();

        this.ticker.add((delta) => {
            this.world.execute(delta, performance.now());
            InputManager.instance.update();
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
            .addComponent(Interactable)
            .addComponent(BotController, { speed: 0.2 });
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
