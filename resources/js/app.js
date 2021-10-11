import './extensions';
import '../css/main.scss';
import { Engine } from './engine';
import { Alert } from './ui/dialogs/alert';
import { Editor } from './ui/editor/editor';
import { DevTools } from './ui/dev/dev-tools';
import { FileTree } from './ui/editor/file-tree';
import { EditorPanel } from './ui/editor/editor-panel';
import { NetworkManager } from './core/managers/network-manager';

class App {
    constructor() {
        this.componentMap = new Map();
        this.components = [Alert, Editor, EditorPanel, FileTree, DevTools];
        this.engine = new Engine({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x585858,
            antialias: true,
            autoDensity: true,
            resolution: 1,
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
        NetworkManager.connect();
    }
}

const app = new App();
app.init();
