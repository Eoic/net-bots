import { UUID4 } from '../../utils/uuid';
import { Component } from '../core/component';

class DirectoryNode {
    public readonly id: string;
    private _name: string;
    public isSelected: boolean;

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

    constructor(name: string) {
        this.id = UUID4.generate();
        this.name = name;
        this.isSelected = false;
    }
}

class FolderNode extends DirectoryNode {
    public ancestor: FolderNode | undefined;
    public nodes: Array<FileNode | FolderNode>;
    public nodeMap: Map<string, FileNode | FolderNode>;
    public isOpen: boolean;

    constructor(name: string, ancestor?: FolderNode) {
        super(name);
        this.nodes = [];
        this.isOpen = false;
        this.ancestor = ancestor;
        this.nodeMap = new Map<string, FileNode | FolderNode>();
    }

    public add(node: FileNode | FolderNode) {
        if (this.nodeMap.has(node.name)) {
            // TODO: Fix counter appending.
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

    public toggle() {
        this.isOpen = !this.isOpen;
    }
}

class FileNode extends DirectoryNode {
    public content: string;
    public ancestor: FolderNode | undefined;

    constructor(name: string, ancestor?: FolderNode) {
        super(name);
        this.content = '';
        this.ancestor = ancestor;
    }
}

class FileTree extends Component {
    private root: FolderNode;
    private fileList: HTMLElement | null;
    private fileTree: HTMLElement | null;
    private selectedNode: FileNode | FolderNode | undefined;
    private directoryNodesLUT: Map<string, FileNode | FolderNode>;
    private templateDisplayMap: Map<string, (node: FileNode | FolderNode, depth: number) => Node | undefined>;

    constructor() {
        super();
        this.root = new FolderNode('Root');
        this.fileList = document.getElementById('file-list');
        this.fileTree = document.getElementById('file-tree');
        this.directoryNodesLUT = new Map();
        this.templateDisplayMap = new Map([
            [FileNode.name, (node: FileNode | FolderNode, depth: number) => this.getFileTemplate(node, depth)],
            [FolderNode.name, (node: FileNode | FolderNode, depth: number) => this.getFolderTemplate(node, depth)],
        ]);

        this.initFileTree();
        this.bindEvents();
        this.update();
    }

    private bindEvents() {
        this.fileList?.addEventListener('click', (event) => this.handleClick(event));
        this.fileList?.addEventListener('contextmenu', (event) => this.handleNodeContextMenu(event));
        this.fileTree?.addEventListener('contextmenu', (event) => this.handleTreeContextMenu(event));
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
        this.root.isOpen = true;
        const folder1 = new FolderNode('Folder 1', this.root);
        const folder2 = new FolderNode('Folder 2', this.root);
        this.root.add(new FileNode('Top level file', this.root));
        folder2.isOpen = true;
        this.root.add(folder1);
        this.root.add(folder2);
        const file1 = new FileNode('File 1', folder1);
        const file2 = new FileNode('File 2', folder1);
        folder1.add(file1);
        folder1.add(file2);
        // const file3 = new FileNode('File 3', folder2);
        const folder3 = new FolderNode('Folder 3', folder2);
        const folder4 = new FolderNode('Folder 4', folder2);
        const folder5 = new FolderNode('Folder 4', folder2);

        for (let i = 0; i < 10; i++) {
            folder2.add(new FileNode(`File ${Math.round(Math.random() * 1000) + 100}`, folder2));
        }

        folder2.add(folder3);
        folder2.add(folder4);
        folder2.add(folder5);
        const file4 = new FileNode('File 4', folder3);
        folder3.add(file4);

        for (let i = 0; i < 5; i++) {
            folder5.add(new FileNode(`File ${Math.round(Math.random() * 1000) + 100}`, folder5));
        }
    }

    private getPadding(count: number) {
        return [...new Array((count - 1) * 2).keys()].map((_key) => '&nbsp; ').join('');
    }

    private getFileTemplate(node: FileNode | FolderNode, depth: number): Node | undefined {
        const fileTemplate = document.createElement('template');

        fileTemplate.innerHTML = `
            <button class='btn full-width ${node.isSelected ? 'active' : ''}' id=${node.id}>
                ${this.getPadding(depth)} <i class='fas fa-file-code'></i> ${node.name}
            </button>
        `;

        return fileTemplate.content.firstElementChild?.cloneNode(true);
    }

    private getFolderTemplate(node: FileNode | FolderNode, depth: number): Node | undefined {
        const folderTemplate = document.createElement('template');
        const arrowDirection = (node as FolderNode).isOpen ? 'down' : 'right';

        folderTemplate.innerHTML = `
            <button class='btn full-width ${node.isSelected ? 'active' : ''}' id=${node.id}>
                ${this.getPadding(depth)} <i class='fas fa-arrow-${arrowDirection}'></i> ${node.name}
            </button>
        `;

        return folderTemplate.content.firstElementChild?.cloneNode(true);
    }

    private traverse(
        node: FileNode | FolderNode,
        displayCallback: (node: FileNode | FolderNode, depth: number) => void,
        depth: number = 0
    ) {
        if (node.ancestor && !node.ancestor?.isOpen) {
            return;
        }

        displayCallback(node, depth);
        node instanceof FolderNode && node.nodes.forEach((folderNode) => this.traverse(folderNode, displayCallback, depth + 1));
    }

    public update() {
        if (this.fileList) {
            this.fileList.innerHTML = '';
        }

        this.traverse(this.root, (node: FileNode | FolderNode, depth: number) => {
            const nodeTemplateMethod = this.templateDisplayMap.get(node.constructor.name);

            if (nodeTemplateMethod && node.ancestor) {
                const nodeTemplate = nodeTemplateMethod(node, depth);

                if (nodeTemplate) {
                    this.fileList?.appendChild(nodeTemplate);
                }
            }

            this.directoryNodesLUT.set(node.id, node);
        });
    }

    private handleClick(event: MouseEvent) {
        if (this.selectedNode) {
            this.selectedNode.isSelected = false;
        }

        this.selectedNode = this.directoryNodesLUT.get((event.target as HTMLElement).id);

        if (!this.selectedNode) {
            return;
        }

        this.selectedNode.isSelected = true;

        if (this.selectedNode instanceof FolderNode) {
            this.selectedNode.toggle();
        }

        window.location.hash = '#file-list';
        this.update();
    }

    private handleNodeContextMenu(event) {
        if (event.target.parentNode.id === 'file-list') {
            event.preventDefault();
            console.log('File node');
        }
    }

    private handleTreeContextMenu(event) {
        if (event.target.parentNode.id === 'file-tree') {
            event.preventDefault();
            console.log('File tree');
        }
    }
}

export { FileTree };
