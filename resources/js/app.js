import '../css/main.scss';
import { Engine } from './engine';
import { Editor } from './components/editor/editor';
import { EditorPanel } from './components/editor/editor-panel';
import { FileTree } from './components/editor/file-tree';

class App {
    constructor() {
        this.components = [Editor, EditorPanel, FileTree];
        this.engine = new Engine({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x585858,
            antialias: true,
        });

        this.engine.run();
        this.initComponents();
    }

    initComponents() {
        this.components.forEach((componentType) => {
            new componentType();
        });
    }
}

new App();
