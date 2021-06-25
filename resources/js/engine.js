import { World } from 'ecsy';
import * as PIXI from 'pixi.js';
import { Graphics, RenderTexture, Sprite } from 'pixi.js';
import { Position, Renderable, Shape, Velocity } from './core/components';
import { MoveableSystem, RendererSystem } from './core/systems';
import { EventManager } from './core/managers/event-manager';
import { InputManager, Keys } from './core/managers/input-manager';

const SPEED = 3;
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
    this.handleEvents();
    this.registerComponents([Position, Renderable, Shape, Velocity]);
    this.registerSystems([MoveableSystem, RendererSystem]);
    this.createEntities();
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

  createEntities() {
    for (let i = 0; i < NUM_ELEMENTS; i++) {
      this.world
        .createEntity()
        .addComponent(Velocity, this.getRandomVelocity())
        .addComponent(Shape, this.getRandomShape())
        .addComponent(Position, this.getRandomPosition())
        .addComponent(Renderable);
    }
  }

  getRandomVelocity() {
    return {
      x: SPEED * (2 * Math.random() - 1),
      y: SPEED * (2 * Math.random() - 1),
    };
  }

  getRandomPosition() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    };
  }

  getRandomShape() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xfff000);
    graphics.drawRect(0, 0, 50, 50);
    graphics.endFill();
    const texture = this.app.renderer.generateTexture(graphics);
    const sprite = new Sprite(texture);
    this.app.stage.addChild(sprite);
    return { sprite: sprite };
  }
}
