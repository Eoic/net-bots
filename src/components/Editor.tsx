import React from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

export const Editor = () => (
  <AceEditor
    mode="javascript"
    theme="github"
    onChange={() => {}}
    name="editor"
    editorProps={{ $blockScrolling: true }}
  />
);
