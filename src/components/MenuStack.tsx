import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

type Props = {
    menu: React.RefObject<HTMLUListElement>
}

export const MenuStack = ({ menu }: Props) => {
    const handleClick = () => {
        if (menu) {
            menu.current?.classList.toggle('visible');
        }
    }

    return (
        <>
            <button className='btn round menu-stack' onClick={handleClick}>
                <FontAwesomeIcon icon={faBars}/>
            </button>
            <div className='clearfix'/>
        </>
    )
}