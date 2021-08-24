import { UUID4 } from '../../utils/uuid';
import { Component } from '../core/component';

class DirectoryNode {
    public readonly id: string;
    private _name: string;
    public selected: boolean;
    public ancestor: DirectoryNode | undefined;

    public get name() {
        return this._name;
    }

    public set name(value: string) {
        if (!value || value.trim() === '') {
            value = 'Untitled';
        } else if (value.length > 255) {
            value = value.substr(0, 255);
        }

        this._name = value;
    }

    constructor(name: string, ancestor?: DirectoryNode) {
        this.id = UUID4.generate();
        this.name = name;
        this.selected = false;
        this.ancestor = ancestor;
    }
}

class FolderNode extends DirectoryNode {
    public nodes: Array<FileNode | FolderNode>;
    public nodeMap: Map<string, FileNode | FolderNode>;
    public isOpen: boolean;

    constructor(name: string, ancestor?: DirectoryNode) {
        super(name, ancestor);
        this.nodes = [];
        this.isOpen = false;
        this.nodeMap = new Map<string, FileNode | FolderNode>();
    }

    public add(node: FileNode | FolderNode) {
        if (this.nodeMap.has(node.name)) {
            let counterNumber = 1;
            let isFound = false;

            while (!isFound) {
                const newName = `${node.name} (${counterNumber})`;

                if (!this.nodeMap.has(newName)) {
                    node.name = newName;
                    isFound = true;
                    break;
                }

                counterNumber++;
            }
        }

        this.nodes.push(node);
        this.nodeMap.set(node.name, node);
    }
}

class FileNode extends DirectoryNode {
    public content: string;

    constructor(name: string, ancestor?: DirectoryNode) {
        super(name, ancestor);
        this.content = '';
    }
}

class FileTree extends Component {
    private root: FolderNode;
    private fileList: HTMLElement | null;

    constructor() {
        super();
        this.root = new FolderNode('Root');
        this.fileList = document.getElementById('file-list');
        this.initFileTree();
        this.update();
    }

    /**
     * Folder 1
     *  |-- File 1
     *  |-- File 2
     * Folder 2
     *  |-- File 3
     *  |-- Folder 3
     *       |-- File 4
     *  |-- Folder 4
     */
    private initFileTree() {
        const folder1 = new FolderNode('Folder 1', this.root);
        const folder2 = new FolderNode('Folder 2', this.root);
        this.root.add(folder1);
        this.root.add(folder2);
        const file1 = new FileNode('File 1', folder1);
        const file2 = new FileNode('File 2', folder1);
        folder1.add(file1);
        folder1.add(file2);
        const file3 = new FileNode('File 3', folder2);
        const folder3 = new FolderNode('Folder 3', folder2);
        const folder4 = new FolderNode('Folder 4', folder2);
        const folder5 = new FolderNode('Folder 4', folder2);
        folder2.add(file3);
        folder2.add(folder3);
        folder2.add(folder4);
        folder2.add(folder5);
        const file4 = new FileNode('File 4', folder3);
        const file5 = new FileNode('File 4', folder3);
        folder3.add(file4);
        folder3.add(file5);
    }

    private getFileTemplate(node: FileNode | FolderNode, depth = 0): Node | undefined {
        const fileTemplate = document.createElement('template');

        fileTemplate.innerHTML = `
            <button class='btn full-width' id=${node.id}>
                ${this.getPadding(depth)} <i class='fas fa-file-code'></i> ${node.name}
            </button>
        `;

        return fileTemplate.content.firstElementChild?.cloneNode(true);
    }

    private getPadding(count: number) {
        return [...new Array(count * 2).keys()].map((_key) => '&nbsp; ').join('');
    }

    private traverse(
        node: FileNode | FolderNode,
        displayCallback: (node: FileNode | FolderNode, depth: number) => void,
        depth: number = 0
    ) {
        displayCallback(node, depth);

        if (node instanceof FolderNode) {
            node.nodes.forEach((folderNode) => this.traverse(folderNode, displayCallback, depth + 1));
        }
    }

    public update() {
        this.traverse(this.root, (node: FileNode | FolderNode, depth: number) => {
            const fileElement = this.getFileTemplate(node, depth);

            if (fileElement) {
                this.fileList?.appendChild(fileElement);
            }
        });
    }
}

export { FileTree };
