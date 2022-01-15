import { EdgeSnapDistance, resizeReducer } from '../reducers/resize';
import React, { ReactElement, useRef, useReducer, useEffect } from 'react';

const DrawerHalfWidth = 5;

interface IProps {
    left: React.ReactNode;
    right: React.ReactNode;
    leftMargin?: number;
    rightMargin?: number;
}

const VerticalSplit = ({ left, right, leftMargin = 0, rightMargin = 0 }: IProps): ReactElement => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const drawerRailRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useReducer(resizeReducer, { railSize: { w: 0, h: 0 }, isResizing: false });

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
        if (!state.isResizing || !drawerRailRef.current)
            return;

        let width = event.pageX - DrawerHalfWidth;

        if (width >= window.innerWidth - EdgeSnapDistance - DrawerHalfWidth)
            width = window.innerWidth - DrawerHalfWidth;
        else if (width <= leftMargin + EdgeSnapDistance - DrawerHalfWidth)
            width = leftMargin - DrawerHalfWidth;

        drawerRef.current!.style.gridTemplateColumns = `${width}px 4px 1fr`;
    }

    const handleMouseDown = (event: MouseEvent) => {
        if (!event.target || !(event.target as Node).isEqualNode(drawerRailRef.current))
            return;

        setState({ type: 'beginResize', payload: {} });
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