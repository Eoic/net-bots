import { World } from 'ecsy';
import * as PIXI from 'pixi.js';
import { Application, IApplicationOptions, Sprite, Ticker } from 'pixi.js';
import { Position, Renderable, Velocity } from './core/components';
import { MoveableSystem, RendererSystem } from './core/systems';
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
    this.registerComponents([Position, Renderable, Velocity]);
    this.registerSystems([MoveableSystem, RendererSystem]);
    this.grid = new Grid(this.app.renderer, {
      tilesPerXAxis: 32,
      tilesPerYAxis: 18,
      tileWidth: 64,
      tileHeight: 64,
      fillColor: 0xf0f0f0,
      outlineColor: 0xd9d9d9,
    });

    this.app.stage.addChild(this.grid);
    this.createPlayerEntity(this.grid);
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

  private createPlayerEntity(parent) {
    this.world
      .createEntity()
      .addComponent(Velocity, { x: 15, y: 15 })
      .addComponent(Position, { x: window.innerWidth / 2 - 20, y: window.innerHeight / 2 - 20 })
      .addComponent(Renderable, this.getSprite(parent));
  }

  private getSprite(parent) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0x4073ff);
    graphics.drawRect(0, 0, 50, 50);
    graphics.endFill();
    const texture = this.app.renderer.generateTexture(graphics);
    const sprite = new Sprite(texture);
    this.app.stage.addChild(sprite);
    parent.addChild(sprite);
    return { sprite: sprite };
  }
}
