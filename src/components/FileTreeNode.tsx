import { faFileCode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement } from 'react'

interface Props {
    name: string;
}

function FileTreeNode(props: Props): ReactElement {
    return (
        <button className='btn full-width-min active'>
            <i className='icon' style={{ width: 18, display: 'inline-block' }}>
                <FontAwesomeIcon icon={faFileCode}/>
            </i>
            {props.name}
        </button>
    )
}

export default FileTreeNode
