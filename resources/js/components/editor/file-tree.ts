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
    public isOpen: boolean;

    constructor(name: string, ancestor?: FolderNode) {
        super(name);
        this.nodes = [];
        this.isOpen = false;
        this.ancestor = ancestor;
    }

    public add(node: FileNode | FolderNode) {
        let counter = 1;
        const takenNamesMap = new Map<string, boolean>();
        const nameTemplate = () => `${node.name} (${counter})`;
        this.nodes.forEach((item) => takenNamesMap.set(item.name, true));

        if (takenNamesMap.has(node.name)) {
            while (takenNamesMap.has(nameTemplate())) counter++;
            node.name = nameTemplate();
        }

        this.nodes.push(node);
        this.nodes.sort((left, right) => {
            if (left instanceof FileNode) return -1;
            else if (right instanceof FileNode) return 1;
            else return 0;
        });
    }

    public delete(node: FileNode | FolderNode) {
        const ancestor = node.ancestor ? node.ancestor : this;
        const targetIndex = ancestor.nodes.indexOf(node);

        if (targetIndex !== -1) {
            ancestor.nodes = ancestor.nodes.filter((item) => item.id !== node.id);
        }
    }

    public clone(node: FileNode | FolderNode, defaultAncestor?: FolderNode) {
        let ancestor = node.ancestor ? node.ancestor : this;

        if (defaultAncestor) {
            ancestor = defaultAncestor;
        }

        if (node instanceof FileNode) {
            const nodeCopy = new FileNode(node.name, ancestor);
            nodeCopy.content = node.content;
            ancestor.add(nodeCopy);
        } else if (node instanceof FolderNode) {
            const nodeCopy = new FolderNode(node.name, ancestor);
            ancestor.add(nodeCopy);
            node.nodes.forEach((innerNode) => this.clone(innerNode, nodeCopy));
        }
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

const ContextMenuTemplate = `
    <button id='rename' class='btn full-width'>
        <span> Rename </span>
        <span> F2 </span>
    </button>
    <button id='clone' class='btn full-width'>
        <span> Clone </span>
        <span> Ctrl + D </span>
    </button>
    <button id='delete' class='btn full-width'>
        <span> Delete </span>
        <span> Del </span>
    </button>
    <button id='new-file' class='btn full-width'>
        <span> New file </span>
    </button>
    <button id='new-folder' class='btn full-width'>
        <span> New folder </span>
    </button>
`;

const TreeMenuElements = ['new-file', 'new-folder'];
const FileMenuElements = ['rename', 'clone', 'delete'];
const FolderMenuElements = ['rename', 'clone', 'delete', 'new-file', 'new-folder'];

class FileTree extends Component {
    private root: FolderNode;
    private fileList: HTMLElement | null;
    private fileTree: HTMLElement | null;
    private contextMenu: HTMLElement | null;
    private contextMenuFocusElement: HTMLElement | null;
    private canCloseContextMenu: boolean;
    private selectedNode: FileNode | FolderNode | undefined;
    private directoryNodesLUT: Map<string, FileNode | FolderNode>;
    private templateDisplayMap: Map<string, (node: FileNode | FolderNode, depth: number) => Node | undefined>;

    constructor() {
        super();
        this.root = new FolderNode('Root');
        this.fileList = document.getElementById('file-list');
        this.fileTree = document.getElementById('file-tree');
        this.contextMenu = document.getElementById('file-tree-context-menu');
        this.directoryNodesLUT = new Map();
        this.canCloseContextMenu = true;
        this.templateDisplayMap = new Map([
            [FileNode.name, (node: FileNode | FolderNode, depth: number) => this.getFileTemplate(node, depth)],
            [FolderNode.name, (node: FileNode | FolderNode, depth: number) => this.getFolderTemplate(node, depth)],
        ]);

        this.initFileTree();
        this.initContextMenu();
        this.bindEvents();
        this.update();
    }

    private initContextMenu() {
        const contextActionsMap = new Map<string, any>([
            ['rename', () => this.handleRename()],
            ['clone', () => this.handleClone()],
            ['delete', () => this.handleDelete()],
            ['new-file', () => this.handleNewFile()],
            ['new-folder', () => this.handleNewFolder()],
        ]);

        this.contextMenu!.innerHTML = ContextMenuTemplate;

        contextActionsMap.forEach((actionHandler, id) => {
            const button = document.getElementById(id);

            button?.addEventListener('click', (event) => {
                actionHandler(event);
                this.canCloseContextMenu = true;
                this.contextMenuFocusElement = null;
                this.contextMenu?.classList.add('hidden');
            });
        });
    }

    private bindEvents() {
        this.fileList?.addEventListener('click', (event) => this.handleClick(event));
        this.fileList?.addEventListener('contextmenu', (event) => this.handleNodeContextMenu(event));
        this.fileTree?.addEventListener('contextmenu', (event) => this.handleTreeContextMenu(event));
        this.contextMenu?.addEventListener('mousedown', () => this.handleContextMenuMouseDown());
        this.contextMenu?.addEventListener('focusout', () => this.handleContextMenuClose());
        this.contextMenu?.addEventListener('mouseenter', () => this.handleContextMenuEnter());
        this.contextMenu?.addEventListener('mouseleave', () => this.handleContextMenuLeave());
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
        // folder2.isOpen = true;
        this.root.add(folder1);
        this.root.add(folder2);
        const file1 = new FileNode('File 1', folder1);
        const file2 = new FileNode('File 2', folder1);
        folder1.add(file1);
        folder1.add(file2);

        const folder3 = new FolderNode('Folder 3', folder2);
        const folder4 = new FolderNode('Folder 4', folder2);
        const folder5 = new FolderNode('Folder 4', folder2);

        for (let i = 0; i < 10; i++) {
            folder2.add(new FileNode(`File`, folder2));
        }

        folder2.add(folder3);
        folder2.add(folder4);
        folder2.add(folder5);
        const file4 = new FileNode('File 4', folder3);
        folder3.add(file4);

        for (let i = 0; i < 5; i++) {
            folder5.add(new FileNode(`File with long title`, folder5));
        }
    }

    private getPadding(count: number) {
        return [...new Array((count - 1) * 2).keys()].map((_key) => '&nbsp; ').join('');
    }

    private getFileTemplate(node: FileNode | FolderNode, depth: number): Node | undefined {
        const fileTemplate = document.createElement('template');

        fileTemplate.innerHTML = `
            <button class='btn full-width-min ${node.isSelected ? 'active' : ''}' id=${node.id}>
                ${this.getPadding(depth)} <i class='fas fa-file-code'></i> ${node.name}
            </button>
        `;

        return fileTemplate.content.firstElementChild?.cloneNode(true);
    }

    private getFolderTemplate(node: FileNode | FolderNode, depth: number): Node | undefined {
        const folderTemplate = document.createElement('template');
        const arrowDirection = (node as FolderNode).isOpen ? 'minus' : 'plus';

        folderTemplate.innerHTML = `
            <button class='btn full-width-min ${node.isSelected ? 'active' : ''}' id=${node.id}>
                ${this.getPadding(depth)} <i class='fas fa-${arrowDirection}'></i> ${node.name}
            </button>
        `;

        return folderTemplate.content.firstElementChild?.cloneNode(true);
    }

    private showContextMenu(event: MouseEvent, visibleButtons: string[]) {
        if (!this.contextMenu) return;

        const contextMenuPosition = { x: event.clientX, y: event.clientY };
        this.contextMenu.classList.remove('hidden');

        if (event.clientX + this.contextMenu.offsetWidth > window.innerWidth) {
            contextMenuPosition.x -= this.contextMenu.offsetWidth;
        }

        if (event.clientY + this.contextMenu.offsetHeight > window.innerHeight) {
            contextMenuPosition.y -= this.contextMenu.offsetHeight;
        }

        this.contextMenu.style.left = `${contextMenuPosition.x}px`;
        this.contextMenu.style.top = `${contextMenuPosition.y}px`;

        this.contextMenu.querySelectorAll('button').forEach((button) => {
            if (!visibleButtons.includes(button.id)) button.style.display = 'none';
            else button.style.display = 'flex';
        });

        this.contextMenu.focus();
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
        if (this.fileList) this.fileList.innerHTML = '';

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

        this.update();
    }

    private handleNodeContextMenu(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!event.target || !target.parentNode) return;

        const node: FileNode | FolderNode | undefined = this.directoryNodesLUT.get(target.id);

        if ((target.parentNode as HTMLElement).id === 'file-list' && node) {
            event.preventDefault();
            this.contextMenuFocusElement = event.target as HTMLElement;
            this.showContextMenu(event, node instanceof FileNode ? FileMenuElements : FolderMenuElements);
        }
    }

    private handleTreeContextMenu(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!event.target || !target.parentNode) return;

        if ((target.parentNode as HTMLElement).id === 'file-tree') {
            event.preventDefault();
            this.showContextMenu(event, TreeMenuElements);
        }
    }

    private handleContextMenuClose() {
        if (this.canCloseContextMenu) {
            this.contextMenu?.classList.add('hidden');
        }

        this.canCloseContextMenu = true;
    }

    private handleContextMenuLeave() {
        if (this.contextMenuFocusElement && this.contextMenuFocusElement instanceof HTMLElement) {
            this.contextMenuFocusElement.classList.remove('focused');
        }
    }

    private handleContextMenuMouseDown() {
        this.canCloseContextMenu = false;
    }

    // Context menu action event handlers.
    private getValidContextNode() {
        if (!this.contextMenuFocusElement) return;

        const id = this.contextMenuFocusElement.id;
        const node = this.directoryNodesLUT.get(id);
        return node;
    }

    private handleRename() {
        console.log('Renaming', this.contextMenuFocusElement);
    }

    private handleClone() {
        const node = this.getValidContextNode();

        if (node) {
            this.root.clone(node);
            this.update();
        }
    }

    private handleDelete() {
        const node = this.getValidContextNode();

        if (node) {
            this.root.delete(node);
            this.update();
        }
    }

    private handleNewFile() {
        console.log('Creating new file', this.contextMenuFocusElement);
    }

    private handleNewFolder() {
        console.log('Creating new folder', this.contextMenuFocusElement);
    }

    private handleContextMenuEnter() {
        if (this.contextMenuFocusElement && this.contextMenuFocusElement instanceof HTMLElement) {
            this.contextMenuFocusElement.classList.add('focused');
        }
    }
}

export { FileTree };
