import Editor from './Editor';
import Console from './Console';
import FileTree from './FileTree';
import DrawerTab from './DrawerTab';
import VerticalSplit from './VerticalSplit';
import { EdgeSnapDistance, resizeReducer } from '../reducers/resize';
import { faCode, faTerminal } from '@fortawesome/free-solid-svg-icons';
import React, { ReactElement, useRef, useReducer, useEffect, useState } from 'react';
import ReactAce from 'react-ace/lib/ace';

const Tab = {
    Editor: {
        index: 0,
        icon: faCode
    },
    Console: {
        index: 1,
        icon: faTerminal
    }
}

const DrawerOverlay = (): ReactElement => {
    const editorRef = useRef<ReactAce>(null);
    const drawerRef = useRef<HTMLDivElement>(null);
    const drawerRailRef = useRef<HTMLDivElement>(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [state, setState] = useReducer(resizeReducer, { railSize: { w: 0, h: 0 }, isResizing: false });
    
    const TabContent = {
        [Tab.Editor.index]: <VerticalSplit left={<FileTree />} right={<Editor editorRef={editorRef} />} leftMargin={42} />,
        [Tab.Console.index]: <Console />
    }

    useEffect(() => {
        handleResize();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', handleResize);
        }
    }, [state]);

    const handleMouseMove = (event: MouseEvent) => {
        if (!state.isResizing || !drawerRef.current)
            return;
 
        let height = window.innerHeight - event.pageY + state.railSize.h / 2;

        if (height < state.railSize.h + EdgeSnapDistance)
            height = state.railSize.h;

        if (event.pageY < state.railSize.h / 2 + EdgeSnapDistance)
            height = window.innerHeight;

        drawerRef.current!.style.height = `${height}px`;
        editorRef.current?.editor.resize();
    }

    const handleMouseDown = (event: MouseEvent) => {
        if (!event.target || !(event.target as Node).isEqualNode(drawerRailRef.current))
            return;

        const railHeight = parseInt(window.getComputedStyle(drawerRailRef.current as Element).height);
        setState({ type: 'beginResize', payload: { railSize: { w: 0, h: railHeight } } });
    }

    const handleMouseUp = () => {
        setState({ type: 'endResize' });
    }

    const handleResize = () => {
        if (!drawerRef.current)
            return;

        // TODO: Update editor ref here.
        if (parseInt(window.getComputedStyle(drawerRef.current).height) > window.innerHeight)
            drawerRef.current.style.height = `${window.innerHeight}px`;
    }

    return (
        <div className='drawer' ref={drawerRef}>
            <div className='drawer-rail' ref={drawerRailRef}>
                {Object.entries(Tab).map(([name, { icon, index }]) => <DrawerTab name={name} key={index} icon={icon} handleClick={() => setActiveTabIndex(index)} isActive={index === activeTabIndex} />)}
            </div>
            <div className='drawer-content'>
                {TabContent[activeTabIndex]}
            </div>
        </div>
    )
}

export { DrawerOverlay };
export default DrawerOverlay;