import { Component, Tag } from '../core/component';

const template = `
    <style>
        .file-tree {
            background-color: white;
            grid-area: file-tree;
            margin-top: -16px;
        }
    </style>

    <div class='file-tree'>
        <ul>
            <li> File 1 </li>
            <li> File 2 </li>
            <li> File 3 </li>
            <li> File 4 </li>
            <li> File 5 </li>
            <li> File 6 </li>
        </ul>
    </div>
`;

@Tag('file-tree')
class FileTree extends Component {
    constructor() {
        super(template);
    }
}

export { FileTree };
