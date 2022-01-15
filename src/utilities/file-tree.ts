export enum TreeNodeType {
    Folder,
    File,
}

export class TreeNode<T = void> {
    name: string;
    depth: number;
    data: T | null;
    isOpen: boolean;
    type: TreeNodeType;
    isSelected: boolean;
    children: TreeNode<T>[];

    constructor(name: string, type: TreeNodeType) {
        this.name = name;
        this.data = null;
        this.type = type;
        this.children = [];
        this.isOpen = false;
        this.isSelected = false;
        this.depth = 1;
    }

    add(node: TreeNode<T>) {
        if (this.type === TreeNodeType.File)
            throw new Error('File node cannot have inner elements.');
        
        // TODO: 
        // * Check for conflicting names.
        // * Show name conflicts when creating file / folder in the file tree.
        // * Sorting: folders above files, sorted in alphabetical order A to z.
        node.depth = this.depth + 1;
        this.children.push(node);
        this.sort();
    }

    remove(node: TreeNode<T>) { }

    rename(name: string) { }

    select() { }

    deselect() { }

    open() { }

    close() { }

    clone() {}

    isNameValid() {}

    traverse(node: TreeNode<T> = this) {
        const margin = [...Array(node.depth).keys()].map(i => "-");
        console.log(margin.join(''), node.name);
        node.children.forEach(node => this.traverse(node));
    }

    sort() {
        const compare = (left, right) => {
            if (left > right) return +1;
            if (left < right) return -1;
            return 0;
        }

        this.children.sort((left, right) => compare(left.type, right.type) || compare(left.name, right.name));
    }
}
