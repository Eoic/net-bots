import AceEditor from "react-ace";
import React, { ReactElement, Ref } from 'react'
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import ReactAce from "react-ace/lib/ace";

interface Props {
    editorRef: Ref<ReactAce>
}

const Editor = (props: Props): ReactElement => {
    return (
        <div style={{ marginBottom: 36 }}>
            <AceEditor
                ref={props.editorRef}
                mode="javascript"
                theme="pastel_on_dark"
                onChange={() => { }}
                name="editor"
                className='editor-wrapper'
                height='100%'
                width='auto'
            />
        </div>
    )
}

export { Editor };
export default Editor;
