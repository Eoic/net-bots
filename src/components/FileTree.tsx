import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React from 'react'

interface Props {

}

const FileTree = (props: Props) => {
    return (
        <div className={"file-tree"}>
            <div className='toolbar'>
                <div className='actions'>
                    <button className='btn round small square tooltip'>
                        <FontAwesomeIcon icon={faFileMedical} />
                        <div className="right">
                            <p> New file </p>
                            <i></i>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export { FileTree };
export default FileTree;
