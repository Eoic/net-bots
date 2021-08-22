import CodeFlask from 'codeflask';

// Code editor options.
const editorOptions: CodeFlask.options = {
    tabSize: 4,
    language: 'js',
    lineNumbers: true,
    defaultTheme: false,
};

class Editor {
    private editor: CodeFlask;

    constructor() {
        const editorNode = document.querySelector('#editor') as HTMLElement;
        this.editor = new CodeFlask(editorNode, editorOptions);
        this.editor.updateCode(`import CodeFlask from 'codeflask';

// Code editor options.
const editorOptions: CodeFlask.options = {
    tabSize: 4,
    language: 'js',
    lineNumbers: true,
    defaultTheme: false,
};

class Editor {
    private editor: CodeFlask;

    constructor() {
        const editorNode = document.querySelector('#editor') as HTMLElement;
        this.editor = new CodeFlask(editorNode, editorOptions);
        this.editor.updateCode('// Write code here.');
    }
}

export { Editor };
        `);
    }
}

export { Editor };
