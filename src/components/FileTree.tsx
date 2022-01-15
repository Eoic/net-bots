import { faFileMedical, faFileCode } from '@fortawesome/free-solid-svg-icons';
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
                </div >
            </div>
            <div className='file-list' style={{ overflowX: 'hidden'}}>
                <button className='btn full-width-min active'>
                    <i className='icon' style={{ width: 18, display: 'inline-block' }}>
                        <FontAwesomeIcon icon={faFileCode}/>
                    </i>
                    main filename file
                </button>
            </div>
        </div>
    )
}

export { FileTree };
export default FileTree;
