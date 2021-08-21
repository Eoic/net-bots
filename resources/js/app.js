import '../css/main.scss';
import { Engine } from './engine';
import '../js/components/editor/file-tree';
import '../js/components/editor/code-editor';
import '../js/components/editor/scripting-panel';

class App {
    constructor() {
        this.engine = new Engine({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x585858,
            antialias: true,
        });

        this.engine.run();
    }
}

new App();
