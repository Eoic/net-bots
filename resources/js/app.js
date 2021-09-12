import '../css/main.scss';
import { Engine } from './engine';
import { Editor } from './ui/editor/editor';
import { FileTree } from './ui/editor/file-tree';
import { EditorPanel } from './ui/editor/editor-panel';

class App {
    constructor() {
        this.componentMap = new Map();
        this.components = [Editor, EditorPanel, FileTree];
        this.engine = new Engine({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x585858,
            antialias: true,
        });
    }

    initComponents() {
        this.components.forEach((component) => {
            const componentInstance = new component({ components: this.componentMap });
            this.componentMap.set(componentInstance.constructor.name, componentInstance);
        });
    }

    init() {
        this.engine.run();
        this.initComponents();
    }
}

const app = new App();
app.init();
