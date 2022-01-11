import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'

interface Props {
    name: string;
    icon: IconDefinition;
    isActive?: boolean;
    handleClick: () => void;
}

const DrawerTab = (props: Props) => {
    return (
        <button className={`drawer-tab btn ${props.isActive && 'active'}`} onClick={props.handleClick}>
            <i style={{ marginRight: "0.3em" }}>
                <FontAwesomeIcon icon={props.icon} />
            </i>
            {props.name}
        </button>
    )
}

export { DrawerTab };
export default DrawerTab
