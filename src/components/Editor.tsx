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
import VerticalSplit from './VerticalSplit';

interface Props {
    
}

const Editor = ({}: Props): ReactElement => {
    return (
        <VerticalSplit />
    )
}

export { Editor };
export default Editor;
