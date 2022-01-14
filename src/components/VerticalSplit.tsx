/**
 * Splits content panels by a vertical line.
 */

import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useRef, useReducer, useEffect, useState } from 'react';

const EdgeSnapDistance = 15;

// TODO: Move resizer login and / or create interface to reduce code duplication.

interface IProps {
    left: React.ReactNode;
    right: React.ReactNode;
}

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

const VerticalSplit = ({ left, right }: IProps): ReactElement => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const drawerRailRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useReducer(drawerReducer, { railHeight: 0, isResizing: false });

    useEffect(() => {
        // Update editor.
        //  (editorRef.current as any).editor.resize();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [state]);

    // TODO: Work out correct offset values and create constants.
    const handleMouseMove = (event: MouseEvent) => {
        if (!state.isResizing || !drawerRailRef.current)
            return;

        let width = event.pageX - 5;
        
        if (width >= window.innerWidth - EdgeSnapDistance) {
            width = window.innerWidth - 42 + 37;
        } else if (width <= 42 + EdgeSnapDistance - 5) {
            width = 42 - 5; // Left margin (read from props.)
        }

         drawerRef.current!.style.gridTemplateColumns = `${width}px 4px 1fr`;
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
        <div className='panel-grid' ref={drawerRef}>
            {left}
            <div className='drawer-vertical' ref={drawerRailRef}></div>
            {right}
        </div>
    )
}

export { VerticalSplit };
export default VerticalSplit;