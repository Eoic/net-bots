import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileMedical, faFileCode } from '@fortawesome/free-solid-svg-icons';

export interface IFileTreeToolbarProps {
}

export function FileTreeToolbar(props: IFileTreeToolbarProps) {
    return (
        <div className='toolbar'>
            <div className='actions'>
                <button className='btn round small square tooltip'>
                    <FontAwesomeIcon icon={faFileMedical} />
                    <div className="right">
                        <p> New file </p>
                    </div>
                </button>
            </div>
        </div>
    );
}
