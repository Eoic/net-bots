import { World } from 'ecsy';
import * as PIXI from 'pixi.js';
import { Container, Graphics, RenderTexture, Sprite } from 'pixi.js';
import { Position, Renderable, Velocity } from './core/components';
import { MoveableSystem, RendererSystem } from './core/systems';
import { EventManager } from './core/managers/event-manager';
import { InputManager, Keys } from './core/managers/input-manager';
import { Grid } from './utils/grid';

const NUM_ELEMENTS = 50;

export class Engine {
  constructor(options) {
    this.app = new PIXI.Application(options);
    this.renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
    this.ticker = PIXI.Ticker.shared;
    this.ticker.autoStart = false;
    this.world = new World();
    document.getElementById('root').appendChild(this.app.view);
    this.app.renderer.autoResize = true;
    this.app.renderer.backgroundColor = 0x2f2f2f;
    this.handleEvents();
    this.registerComponents([Position, Renderable, Velocity]);
    this.registerSystems([MoveableSystem, RendererSystem]);

    this.grid = new Grid(16, 8);
    const tilingSprite = this.grid.generate(0xf0f0f0, this.app.renderer);
    const gridContainer = new Container();
    gridContainer.addChild(tilingSprite);
    this.app.stage.addChild(gridContainer);

    this.createPlayerEntity();
    this.eventManager = new EventManager();
    this.inputManager = new InputManager();
    InputManager.instance.addKey(Keys.W);
    InputManager.instance.addKey(Keys.A);
    InputManager.instance.addKey(Keys.S);
    InputManager.instance.addKey(Keys.D);
    // this.eventManager.on('test', () => {
    //   console.log('Invoked.');
    // });

    // this.eventManager.on('test', () => {
    //   console.log('Something else.');
    // });
  }

  handleEvents() {
    window.onresize = () => this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  run() {
    this.ticker.start();

    this.ticker.add((delta) => {
      this.world.execute(delta, performance.now());
      InputManager.instance.update();
    });
  }

  registerComponents(components) {
    components.forEach((component) => {
      this.world.registerComponent(component);
    });
  }

  registerSystems(systems) {
    systems.forEach((system) => {
      this.world.registerSystem(system);
    });
  }

  createPlayerEntity() {
    this.world
      .createEntity()
      .addComponent(Velocity, { x: 15, y: 15 })
      .addComponent(Position, { x: window.innerWidth / 2 - 20, y: window.innerHeight / 2 - 20 })
      .addComponent(Renderable, this.getSprite());
  }

  getSprite() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0x4073ff);
    graphics.drawRect(0, 0, 50, 50);
    graphics.endFill();
    const texture = this.app.renderer.generateTexture(graphics);
    const sprite = new Sprite(texture);
    this.app.stage.addChild(sprite);
    return { sprite: sprite };
  }
}
