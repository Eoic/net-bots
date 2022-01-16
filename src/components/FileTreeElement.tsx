import React, { ReactElement } from 'react'
import { FileTreeNode, FileTreeNodeType } from '../utilities/file-tree';
import { faFileCode, faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
    node: FileTreeNode;
}

const iconMap = {
    [FileTreeNodeType.File]: faFileCode,
    [FileTreeNodeType.Folder]: faFolder
}

function FileTreeElement(props: Props): ReactElement {
    return (
        <button className={`btn full-width-min ${props.node.isSelected && 'active'}`}>
            <i className='icon' style={{ width: 18, display: 'inline-block', marginLeft: `${(props.node.depth - 1) * 20}px` }}>
                <FontAwesomeIcon icon={iconMap[props.node.type]}/>
            </i>
            {props.node.name}
        </button>
    )
}

export default FileTreeElement;
