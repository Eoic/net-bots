import EditorTab from './EditorTab';
import React, { ReactElement, useEffect, useRef, useState } from 'react'

const EditorTabRibbon = (): ReactElement => {
    const tabRibbonRef = useRef<HTMLDivElement>(null);
    const [canScroll, setCanScroll] = useState(false);

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [canScroll])

    const handleScroll = (event: WheelEvent) => {
        if (!canScroll || !tabRibbonRef.current)
            return;

        tabRibbonRef.current.scrollLeft += event.deltaY;
    }

    return (
        <div className='editor-tabs' ref={tabRibbonRef} onMouseEnter={() => setCanScroll(true)} onMouseLeave={() => setCanScroll(false)}>
            <div style={{ whiteSpace: 'nowrap', display: 'inline-block', width: '100%' }}>
                <EditorTab name='sample'></EditorTab>
                <button className="btn"> main2 </button>
                <button className="btn"> main3 </button>
                <button className="btn"> main </button>
                <button className="btn"> main2 </button>
                <button className="btn"> main3 </button>
                <button className="btn"> main </button>
                <button className="btn"> main2main2main2main2 </button>
                <button className="btn"> main3 </button>
                <button className="btn"> main </button>
                <button className="btn"> main2 </button>
                <button className="btn"> main3 </button>
                <button className="btn"> main </button>
                <button className="btn"> main2 </button>
                <button className="btn"> END </button>
            </div>
        </div>
    )
}

export default EditorTabRibbon
