import '../css/main.scss';
import { Engine } from './engine';
import { Editor } from './components/editor/editor';
import { FileTree } from './components/editor/file-tree';
import { EditorPanel } from './components/editor/editor-panel';

class App {
    constructor() {
        this.componentMap = new Map();
        this.components = [
            {
                type: Editor,
            },
            {
                type: EditorPanel,
            },
            {
                type: FileTree,
                params: {
                    core: this,
                },
            },
        ];

        this.engine = new Engine({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x585858,
            antialias: true,
        });
    }

    initComponents() {
        this.components.forEach((componentData) => {
            const componentInstance = new componentData.type(componentData.params);
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
