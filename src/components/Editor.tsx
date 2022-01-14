// import React from 'react';


// export const Editor = () => (
//   <AceEditor
//     mode="javascript"
//     theme="github"
//     onChange={() => {}}
//     name="editor"
//     editorProps={{ $blockScrolling: true }}
//   />
// );

import React, { ReactElement } from 'react'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

interface Props {
    
}

const Editor = ({}: Props): ReactElement => {
    return (
        <AceEditor
            mode="javascript"
            theme="pastel_on_dark"
            onChange={() => { }}
            name="editor"
            className='editor-wrapper'
            height='100%'
            width='auto'
            style={{ marginBottom: 36 }}
        />
    )
}

export { Editor };
export default Editor;
