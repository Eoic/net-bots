import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import { Component, ComponentParameters } from '../core/component';
import { FileNode, FileTree } from './file-tree';

class Editor extends Component {
    private editor: any;
    private sessions: Map<string, any>;

    constructor(params: ComponentParameters) {
        super(params);
        this.editor = ace.edit('editor');
        this.editor.setTheme('ace/theme/pastel_on_dark');
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
        });

        this.editor.session.setMode('ace/mode/javascript');
        this.editor.session.setValue('');
        this.sessions = new Map();
    }

    public update(file: FileNode) {
        const { id, contentBuffer } = file;

        if (!this.sessions.has(id)) {
            const session = ace.createEditSession(contentBuffer, 'ace/mode/javascript');

            session.on('change', () => {
                file.isSaved = file.content === session.getValue();
                const fileTreeComponent = this.params!.components.get(FileTree.name) as FileTree;
                fileTreeComponent.update();
            });

            this.sessions.set(id, session);
            this.editor.setSession(session);
            return;
        }

        this.editor.setSession(this.sessions.get(id));
    }
}

export { Editor };
