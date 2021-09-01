import { Editor } from './editor';
import { Events } from '../events';
import { UUID4 } from '../../utils/uuid';
import { Component } from '../core/component';
import { Constructable } from '../core/interfaces/constructable';
import { EventManager } from '../../core/managers/event-manager';

export class DirectoryNode {
    public readonly id: string;
    private _name: string;
    public isSelected: boolean;
    public depth: number;

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
        this.depth = 0;
    }
}

export class FolderNode extends DirectoryNode {
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
            nodeCopy.contentBuffer = node.contentBuffer;
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

export class FileNode extends DirectoryNode {
    public content: string;
    public contentBuffer: string;
    public ancestor: FolderNode | undefined;

    constructor(name: string, ancestor?: FolderNode) {
        super(name);
        this.content = '';
        this.contentBuffer = '';
        this.ancestor = ancestor;
    }

    public saveContent() {
        this.content = this.contentBuffer;
    }
}

const ContextMenuTemplate = `
    <button id='rename' class='btn full-width'>
        <span> Rename </span>
        <span> F2 </span>
    </button>
    <button id='clone' class='btn full-width'>
        <span> Clone </span>
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

const FilenameInputTemplate = (value: string, iconType: string, depth: number = 0) => `
    <div class='input-wrapper' style='margin-left: ${(depth - 1) * 20}px'>
        <input id='filename' class='input filename icon' value='${value}' autofocus>
        <label for='filename' class='fas fa-${iconType} icon'></label>
    </div>
`;

const TreeMenuElements = ['new-file', 'new-folder'];
const FileMenuElements = ['rename', 'clone', 'delete'];
const FolderMenuElements = ['rename', 'clone', 'delete', 'new-file', 'new-folder'];

const FileIcon = 'file-code';
const FolderIcon = { OPEN: 'minus', CLOSED: 'plus' };

class FileTree extends Component {
    private root: FolderNode;
    private fileList: HTMLElement | null;
    private fileTree: HTMLElement | null;
    private contextMenu: HTMLElement | null;
    private fileTreeOverlay: HTMLElement | null;
    private contextMenuFocusElement: HTMLElement | null;
    private canCloseContextMenu: boolean;
    private isEditingFilename: boolean;
    private selectedNode: FileNode | FolderNode | undefined;
    private focusedNode: FileNode | FolderNode | undefined;
    private directoryNodesLUT: Map<string, FileNode | FolderNode>;
    private templateDisplayMap: Map<string, (node: FileNode | FolderNode, depth: number) => Node | undefined>;

    constructor(params: object) {
        super(params);
        this.root = new FolderNode('Root');
        this.fileList = document.getElementById('file-list');
        this.fileTree = document.getElementById('file-tree');
        this.fileTreeOverlay = document.getElementById('file-tree-overlay');
        this.contextMenu = document.getElementById('file-tree-context-menu');
        this.directoryNodesLUT = new Map();
        this.canCloseContextMenu = true;
        this.isEditingFilename = false;
        this.templateDisplayMap = new Map([
            [FileNode.name, (node: FileNode | FolderNode, depth: number) => this.getFileTemplate(node, depth)],
            [FolderNode.name, (node: FileNode | FolderNode, depth: number) => this.getFolderTemplate(node, depth)],
        ]);

        this.initContextMenu();
        this.initToolbar();
        this.bindEvents();
        this.update();
    }

    private initContextMenu() {
        const contextActionsMap = new Map<string, any>([
            ['rename', () => this.handleRename()],
            ['clone', () => this.handleClone()],
            ['delete', () => this.handleDelete()],
            ['new-file', () => this.handleNewNode(FileNode)],
            ['new-folder', () => this.handleNewNode(FolderNode)],
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

    private initToolbar() {
        const toolbarActionsMap = new Map<string, any>([
            ['tool-new-file', () => this.handleNewNode(FileNode)],
            ['tool-new-folder', () => this.handleNewNode(FolderNode)],
            ['tool-save', () => this.handleSave()],
        ]);

        toolbarActionsMap.forEach((actionHandler, id) => {
            const button = document?.getElementById(id);
            button?.addEventListener('click', (event) => actionHandler(event));
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
        window?.addEventListener('keyup', (event) => this.handleKeyPress(event));
        EventManager.on(Events.CODE_UPDATE, (eventData: object) => this.handleCodeUpdate(eventData));
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
        const arrowDirection = (node as FolderNode).isOpen ? FolderIcon.OPEN : FolderIcon.CLOSED;

        folderTemplate.innerHTML = `
            <button class='btn full-width-min ${node.isSelected ? 'active' : ''}' id=${node.id}>
                ${this.getPadding(depth)} <i class='fas fa-${arrowDirection}'></i> ${node.name}
            </button>
        `;

        return folderTemplate.content.firstElementChild?.cloneNode(true);
    }

    private showContextMenu(event: MouseEvent, visibleButtons: string[]) {
        if (!this.contextMenu) return;

        const buttons = this.contextMenu.querySelectorAll('button');

        buttons.forEach((button) => {
            button.classList.remove('round-top', 'round-bottom');
            if (!visibleButtons.includes(button.id)) button.style.display = 'none';
            else button.style.display = 'flex';
        });

        const shownButtons: HTMLElement[] = [].filter.call(buttons, (button: HTMLElement) => button.style.display === 'flex');

        if (shownButtons.length > 0) {
            shownButtons[0].classList.add('round-top');
            shownButtons[shownButtons.length - 1].classList.add('round-bottom');
        }

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

            node.depth = depth;
            this.directoryNodesLUT.set(node.id, node);
        });

        this.showOverlay(false);
        this.isEditingFilename = false;
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
        } else {
            const editorComponent = (this.params as any).components.get(Editor.name);
            editorComponent.updateCode(this.selectedNode.contentBuffer);
        }

        this.update();
    }

    private handleNodeContextMenu(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!event.target || !target.parentNode) return;

        this.focusedNode = this.directoryNodesLUT.get(target.id);

        if ((target.parentNode as HTMLElement).id === 'file-list' && this.focusedNode) {
            event.preventDefault();
            this.contextMenuFocusElement = event.target as HTMLElement;
            this.showContextMenu(event, this.focusedNode instanceof FileNode ? FileMenuElements : FolderMenuElements);
        }
    }

    private handleTreeContextMenu(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!event.target || !target.parentNode) return;

        if ((target.parentNode as HTMLElement).id === 'file-tree') {
            event.preventDefault();
            this.contextMenuFocusElement = null;
            this.showContextMenu(event, TreeMenuElements);
        }
    }

    private handleContextMenuClose() {
        if (this.canCloseContextMenu) {
            this.contextMenu?.classList.add('hidden');
            this.focusedNode = undefined;
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

    private getValidContextNode() {
        if (!this.contextMenuFocusElement) return;

        const id = this.contextMenuFocusElement.id;
        const node = this.directoryNodesLUT.get(id);
        return node;
    }

    private handleRename() {
        const node = this.getValidContextNode();

        if (!node) return;

        const inputElement = document.createElement('div');

        inputElement.innerHTML = FilenameInputTemplate(
            node.name,
            node instanceof FileNode ? FileIcon : node.isOpen ? FolderIcon.OPEN : FolderIcon.CLOSED,
            node.depth
        );

        this.bindInputEvents(inputElement, node);
        this.contextMenuFocusElement?.replaceWith(inputElement.firstElementChild as Node);
        this.showOverlay(true);
        this.isEditingFilename = true;

        const input = document.getElementById('filename') as HTMLInputElement;
        input?.focus();
        input?.select();
    }

    private bindInputEvents(inputElement: HTMLDivElement, node: FileNode | FolderNode, append: boolean = false) {
        inputElement.firstElementChild?.addEventListener('focusout', (event: FocusEvent) => {
            node.name = (event.target as HTMLInputElement).value;
            this.update();
        });

        inputElement.firstElementChild?.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (append) node.ancestor?.add(node);
                node.name = (event.target as HTMLInputElement).value;
                this.update();
            } else if (event.key === 'Escape') {
                if (append) node.ancestor?.delete(node);
                this.update();
            }
        });
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

    private handleNewNode(nodeType: Constructable<FileNode | FolderNode>) {
        const inputElement = document.createElement('div');
        const localRootNode = this.focusedNode ? this.focusedNode : this.selectedNode ? this.selectedNode : this.root;

        if (localRootNode instanceof FolderNode) {
            localRootNode.isOpen = true;
            this.update();
        }

        const targetNode = document.getElementById(localRootNode?.id || '');
        const newDirectoryNode = new nodeType('', localRootNode instanceof FolderNode ? localRootNode : this.root);
        inputElement.innerHTML = FilenameInputTemplate(
            '',
            newDirectoryNode instanceof FileNode ? FileIcon : FolderIcon.CLOSED,
            localRootNode instanceof FolderNode ? localRootNode.depth + 1 : localRootNode.depth || 0
        );
        this.bindInputEvents(inputElement, newDirectoryNode, true);

        if (!targetNode) {
            this.fileList?.prepend(inputElement);
        } else if (localRootNode instanceof FileNode) {
            this.fileList?.insertBefore(inputElement, targetNode);
        } else if (localRootNode instanceof FolderNode) {
            targetNode?.after(inputElement);
        }

        this.showOverlay(true);
        const input = document.getElementById('filename') as HTMLInputElement;
        input?.focus();
        input?.select();
    }

    private handleContextMenuEnter() {
        if (!this.contextMenuFocusElement || !(this.contextMenuFocusElement instanceof HTMLElement)) return;
        this.contextMenuFocusElement.classList.add('focused');
    }

    private handleKeyPress(_event) {
        if (this.isEditingFilename) return;
    }

    private showOverlay(isVisible: boolean) {
        if (isVisible) this.fileTreeOverlay?.classList.remove('hidden');
        else this.fileTreeOverlay?.classList.add('hidden');
    }

    private handleSave() {
        if (!this.selectedNode || this.selectedNode instanceof FolderNode) return;
        this.selectedNode.saveContent();
    }

    private handleCodeUpdate(eventData: object) {
        if (!(this.selectedNode instanceof FileNode)) return;
        this.selectedNode.contentBuffer = (eventData as any).code || '';
    }
}

export { FileTree };
