/**
 * Splits content panels by a vertical line.
 */

import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useRef, useReducer, useEffect, useState } from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

const EdgeSnapDistance = 15;

const VerticalSplit = (): ReactElement => {
    const state = [];
    const editorRef = useRef(null);
    const drawerRef = useRef(null);

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
    }, []);

    const handleMouseMove = (event: MouseEvent) => {
        //  if (!state.isResizing || !drawerRef.current)
        //      return;

        //  let height = window.innerHeight - event.pageY + state.railHeight / 2;

        //  if (height < state.railHeight + DrawerSnapDistance)
        //      height = state.railHeight;

        //  if (event.pageY < state.railHeight / 2 + DrawerSnapDistance)
        //      height = window.innerHeight;

        //  drawerRef.current!.style.height = `${height}px`;
    }

    const handleMouseDown = (event: MouseEvent) => {
        //  if (!event.target || !(event.target as Node).isEqualNode(drawerRailRef.current))
        //      return;

        //  const railHeight = parseInt(window.getComputedStyle(drawerRailRef.current as Element).height);
        //  setState({ type: 'beginResize', payload: { railHeight } });
    }

    const handleMouseUp = () => {
        //  setState({ type: 'endResize' });
    }

    /**
     * TODO: Make file tree independent from the vertical drawer.
     */

    return (
        <div className='panel-grid'>
            <div className={"file-tree"}>
                {/* TOOLBAR */}
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
                {/* END TOOLBAR */}
                <div className='drawer-vertical' ref={drawerRef}></div>
            </div>
            <AceEditor
                ref={editorRef}
                mode="javascript"
                theme="pastel_on_dark"
                onChange={() => { }}
                name="editor"
                className='editor-wrapper'
                height='100%'
                width='auto'
                style={{ marginBottom: 36 }}
            // editorProps={{ $blockScrolling: true }}
            />
        </div>
    )
}

export { VerticalSplit };
export default VerticalSplit;