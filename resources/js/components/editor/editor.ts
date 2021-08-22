import CodeFlask from 'codeflask';

const editorOptions = {
    language: 'js',
    lineNumbers: true,
    tabSize: 4,
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
