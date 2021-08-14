import { Component, Tag } from '../core/component';

const template = `
    <style>
        button {
            position: fixed;
        }
    </style>

    <button id='counter' value='0'>
        FileTree <slot name='value'></slot>
    </button>
`;

@Tag('file-tree')
class FileTree extends Component {
    constructor() {
        super(template);
    }
}

export { FileTree };
