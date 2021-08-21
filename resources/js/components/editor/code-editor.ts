import CodeFlask from 'codeflask';
import { Component, Tag } from '../core/component';

const template = `
    <div id='editor'>
    </div>
`;

@Tag('code-editor')
class CodeEditor extends Component {
    constructor() {
        super(template);
        const editorNode = this.shadowRoot!.querySelector('#editor') as HTMLElement;
        new CodeFlask(editorNode, {
            language: 'js',
            styleParent: this.shadowRoot!,
            lineNumbers: true,
            tabSize: 4,
        });
    }
}

export { CodeEditor };
