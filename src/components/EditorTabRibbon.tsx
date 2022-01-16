import React, { Component, ReactElement, useEffect, useRef, useState } from 'react'
import { TreeNode, TreeNodeType } from '../utilities/file-tree';
import EditorTab from './EditorTab';

interface Props {

}
interface State {

}

const generateDirectoryTree = () => {
    const folder0 = new TreeNode('Folder 0', TreeNodeType.Folder);
    const folder1 = new TreeNode('H Folder 1', TreeNodeType.Folder);
    const folder2 = new TreeNode('ZG Folder 2', TreeNodeType.Folder);
    const file0 = new TreeNode('AX File 0', TreeNodeType.File);
    const file1 = new TreeNode('A File 1', TreeNodeType.File);
    const file2 = new TreeNode('B File 2', TreeNodeType.File);

    folder0.add(folder1)
    folder0.add(file0)
    folder0.add(file1)
    folder1.add(folder2)
    folder1.add(file2)

    folder0.traverse()
}

generateDirectoryTree();

const EditorTabRibbon = (): ReactElement => {
    const tabRibbonRef = useRef<HTMLDivElement>(null);
    const [canScroll, setCanScroll] = useState(false);

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [canScroll])

    const handleScroll = (event: WheelEvent) => {
        if (!canScroll || !tabRibbonRef.current)
            return;

        tabRibbonRef.current.scrollLeft += event.deltaY;
    }

    return (
        <div className='editor-tabs' ref={tabRibbonRef} onMouseEnter={() => setCanScroll(true)} onMouseLeave={() => setCanScroll(false)}>
            <div style={{ whiteSpace: 'nowrap', display: 'inline-block', width: '100%' }}>
                <EditorTab name='sample'></EditorTab>
                <button className="btn"> main2 </button>
                <button className="btn"> main3 </button>
                <button className="btn"> main </button>
                <button className="btn"> main2 </button>
                <button className="btn"> main3 </button>
                <button className="btn"> main </button>
                <button className="btn"> main2main2main2main2 </button>
                <button className="btn"> main3 </button>
                <button className="btn"> main </button>
                <button className="btn"> main2 </button>
                <button className="btn"> main3 </button>
                <button className="btn"> main </button>
                <button className="btn"> main2 </button>
                <button className="btn"> END </button>
            </div>
        </div>
    )
}

export default EditorTabRibbon
