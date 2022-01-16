import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement } from 'react'

interface Props {
    name: string;
}

function EditorTab(props: Props): ReactElement {
    return (
        <button className='btn' style={{ padding: "8px 8px" }}>
            {/* replace button with div or span. */}
            {props.name}
            {/* Absolute / relative position? */}
            <span style={{ marginLeft: 6, display: 'inline-block', height: 19, width: 19, borderRadius: 4 }}>
                <FontAwesomeIcon icon={faTimes}/>
            </span>
        </button>
    )
}

export default EditorTab
