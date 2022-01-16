import React, { useState, useEffect } from 'react'
import { FileTreeNode, FileTreeNodeType } from '../utilities/file-tree';
import FileTreeElement from './FileTreeElement';
import { FileTreeToolbar } from './FileTreeToolbar';

interface Props {

}

const generateFiles = (): FileTreeNode => {
    const folder0 = new FileTreeNode('Folder 0', FileTreeNodeType.Folder);
    const folder1 = new FileTreeNode('H Folder 1', FileTreeNodeType.Folder);
    const folder2 = new FileTreeNode('ZG Folder 2', FileTreeNodeType.Folder);
    const file0 = new FileTreeNode('AX File 0', FileTreeNodeType.File);
    const file1 = new FileTreeNode('A File 1', FileTreeNodeType.File);
    const file2 = new FileTreeNode('B File 2', FileTreeNodeType.File);

    folder0.add(folder1)
    folder0.add(file0)
    folder0.add(file1)
    folder1.add(folder2)
    folder1.add(file2)
    return folder0;
}

// TODO: Should have access to editor ref.
const FileTree = (props: Props) => {
    // Use singular for as this is only the root node?
    // const [nodes, setNodes] = useState<FileTreeNode>();

    // useEffect(() => {
    //     setNodes(generateFiles());
    // }, [])

    // Traverse entire tree and render elements.
    const traverse = (node: FileTreeNode) => {
        const elements: JSX.Element[] = [];
        
        node.collect(node, (nextNode) => {
            const element = <FileTreeElement node={nextNode} />
            elements.push(element);
        });

        return elements;
    }

    return (
        <div className="file-tree">
            <FileTreeToolbar />
            <div className='file-list' style={{ overflowX: 'hidden'}}>
                {traverse(generateFiles())}
            </div>
        </div>
    )
}

export { FileTree };
export default FileTree;