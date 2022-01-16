export enum FileTreeNodeType {
    Folder,
    File,
}

export class FileTreeNode<T = void> {
    name: string;
    depth: number;
    data: T | null;
    isOpen: boolean;
    type: FileTreeNodeType;
    isSelected: boolean;
    children: FileTreeNode<T>[];

    constructor(name: string, type: FileTreeNodeType) {
        this.name = name;
        this.data = null;
        this.type = type;
        this.children = [];
        this.isOpen = false;
        this.isSelected = false;
        this.depth = 1;
    }

    add(node: FileTreeNode<T>) {
        if (this.type === FileTreeNodeType.File)
            throw new Error('File node cannot have inner elements.');
        
        // TODO: 
        // * Check for conflicting names.
        // * Show name conflicts when creating file / folder in the file tree.
        // * Sorting: folders above files, sorted in alphabetical order A to z.
        node.depth = this.depth + 1;
        this.children.push(node);
        this.sort();
    }

    remove(node: FileTreeNode<T>) { }

    rename(name: string) { }

    select() { }

    deselect() { }

    open() { }

    close() { }

    clone() {}

    isNameValid() {}

    collect(node: FileTreeNode<T> = this, callback: (node: FileTreeNode<T>) => void) {
        callback(node);
        node.children.forEach(node => this.collect(node, callback));
    }

    sort() {
        const compare = (left: string | number, right: string | number) => {
            if (left > right) return +1;
            if (left < right) return -1;
            return 0;
        }

        this.children.sort((left, right) => compare(left.type, right.type) || compare(left.name, right.name));
    }
}
