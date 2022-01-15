import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface Props {
    name: string;
    isActive?: boolean;
    icon: IconDefinition;
    handleClick: () => void;
}

const DrawerTab = (props: Props) => {
    return (
        <button className={`drawer-tab btn ${props.isActive && 'active'}`} onClick={props.handleClick}>
            <i className='icon'>
                <FontAwesomeIcon icon={props.icon} />
            </i>
            {props.name}
        </button>
    )
}

export { DrawerTab };
export default DrawerTab
