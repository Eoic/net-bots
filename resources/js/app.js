import '../css/app.css';
import { Engine } from './engine';

class App {
  constructor() {
    this.engine = new Engine({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
    });
    this.engine.run();
  }
}

new App();
