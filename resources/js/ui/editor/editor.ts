import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

class Editor {
    private editor: any;
    private sessions: Map<string, any>;

    constructor() {
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

    public update(fileData: { id: string; content: string }) {
        const { id, content } = fileData;

        if (!this.sessions.has(id)) {
            const session = ace.createEditSession(content, 'ace/mode/javascript');
            this.sessions.set(id, session);
            this.editor.setSession(session);
            return;
        }

        this.editor.setSession(this.sessions.get(id));
    }
}

export { Editor };
