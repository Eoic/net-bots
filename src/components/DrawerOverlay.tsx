/**
 * Draggable overlay. Contains list ot tabs for opening different
 * content panels (e.g. editor, console).
 */

import { faCode, faTerminal } from '@fortawesome/free-solid-svg-icons';
import React, { ReactElement, useRef, useReducer, useEffect } from 'react'
import DrawerTab from './DrawerTab';

const DrawerSnapDistance = 15;
const DrawerDefaultHeight = 250;

type State = {
    railHeight: number;
    isResizing: boolean;
}

type ActionPayload = {
    railHeight: number
}

type Action =
    | {
        type: 'resize',
        payload: ActionPayload
    } | {
        type: 'beginResize',
        payload: ActionPayload
    } | {
        type: 'endResize'
    }

const drawerReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'resize':
            return {
                isResizing: state.isResizing,
                railHeight: action.payload.railHeight
            }
        case 'beginResize':
            return {
                isResizing: true,
                railHeight: action.payload.railHeight
            }
        case 'endResize':
            return {
                isResizing: false,
                railHeight: state.railHeight
            }
        default:
            return { ...state }
    }
}

const DrawerOverlay = (): ReactElement => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const drawerRailRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useReducer(drawerReducer, { railHeight: 0, isResizing: false });

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [state]);

    const handleMouseMove = (event: MouseEvent) => {
        if (!state.isResizing || !drawerRef.current)
            return;

        let height = window.innerHeight - event.pageY + state.railHeight / 2;
        
        if (height < state.railHeight + DrawerSnapDistance)
            height = state.railHeight;
        
        if (event.pageY < state.railHeight / 2 + DrawerSnapDistance)
            height = window.innerHeight;

        drawerRef.current!.style.height = `${height}px`;
    }

    const handleMouseDown = (event: MouseEvent) => {
        if (!event.target || !(event.target as Node).isEqualNode(drawerRailRef.current))
            return;
        
        const railHeight = parseInt(window.getComputedStyle(drawerRailRef.current as Element).height);
        setState({ type: 'beginResize', payload: { railHeight } });
    }

    const handleMouseUp = () => {
        setState({ type: 'endResize' });
    }

    return (
        <div className='drawer' ref={drawerRef}>
            <div className='drawer-rail' ref={drawerRailRef}>
                <DrawerTab name='Editor' icon={faCode} />
                <DrawerTab name='Console' icon={faTerminal} />
            </div>
        </div>
    )
}

export { DrawerOverlay };
export default DrawerOverlay;