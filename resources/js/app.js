import '../css/app.css';
import { Engine } from './engine';

class App {
    constructor() {
        this.engine = new Engine({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x2f2f2f,
            antialias: true,
        });

        this.engine.run();
    }
}

new App();
