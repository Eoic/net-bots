import CodeFlask from 'codeflask';
import { Events } from '../events';
import { EventManager } from '../../core/managers/event-manager';

const editorOptions: CodeFlask.options = {
    tabSize: 4,
    language: 'js',
    lineNumbers: true,
    defaultTheme: false,
};

class Editor {
    private editor: CodeFlask;

    constructor() {
        const editorNode = document.getElementById('editor') as HTMLElement;
        this.editor = new CodeFlask(editorNode, editorOptions);
        this.editor.updateCode('');
        this.editor.onUpdate((code: string) => EventManager.dispatch(Events.CODE_UPDATE, { code }));
    }

    public updateCode(content: string) {
        this.editor.updateCode(content);
    }
}

export { Editor };
