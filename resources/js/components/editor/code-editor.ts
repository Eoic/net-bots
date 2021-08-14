import { Component, Tag } from '../core/component';

const template = `
    <div id='editor'>
    </div>
`;

@Tag('code-editor')
class CodeEditor extends Component {
    constructor() {
        super(template);
    }
}

export { CodeEditor };
