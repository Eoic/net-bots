import '../../../css/editor.css';
import { Component, Tag } from '../core/component';

const template = `
    <style>
        .panel {
            position: fixed;
            min-height: 25vh;
            height: 300px;
            bottom: 0;
            left: 0;
            width: 100vw;
            background-color: #1a1a1a;
        }

        .panel-grid {
            display: grid;
            grid-template-areas:
                "file-tree editor";
            grid-template-columns: minmax(240px, 0.1fr) 1fr;
            grid-template-rows: 1fr;
        }

        .panel-drawer {
            height: 25px;
            background-color: #1a1a1a;
            cursor: row-resize;
            display: flex;
            padding: 10px;
            gap: 8px;
        }
    </style>

    <link rel='stylesheet' href='http://localhost:8080/assets/app.css'>

    <div class='panel' id='panel'>
        <div class='panel-drawer'>
            <button class="tab"> Editor </button>
            <button class="tab"> Console </button>
        </div>
        <div class='panel-grid'>
            <slot name='file-tree'></slot>
            <slot name='editor'></slot>
        </div>
    </div>
`;

@Tag('scripting-panel')
class ScriptingPanel extends Component {
    constructor() {
        super(template);
    }
}

export { ScriptingPanel };
