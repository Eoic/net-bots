import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import { Component, ComponentParameters } from '../core/component';
import { FileNode, FileTree } from './file-tree';

class Editor extends Component {
    private editor: any;
    private sessions: Map<string, any>;
    private settingsPanel: HTMLElement | null;

    constructor(params: ComponentParameters) {
        super(params);
        this.editor = ace.edit('editor');
        this.editor.setTheme('ace/theme/pastel_on_dark');
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
        });

        this.editor.commands.addCommand({
            name: 'Save',
            readonly: true,
            bindKey: { win: 'Ctrl-S' },
            exec: (editor) => {
                const id = editor.session.fileId;
                const fileTreeComponent = this.params!.components.get(FileTree.name) as FileTree;
                const file = fileTreeComponent.getNodeById(id);

                if (file && file instanceof FileNode) {
                    file.content = file.contentBuffer;
                    fileTreeComponent.update();
                }
            },
        });

        this.sessions = new Map();
        this.editor.session.setValue('');
        this.editor.session.setMode('ace/mode/javascript');
        this.settingsPanel = document.getElementById('editor-settings');
    }

    public update(file: FileNode) {
        const { id, contentBuffer } = file;

        if (!this.sessions.has(id)) {
            const session = ace.createEditSession(contentBuffer, 'ace/mode/javascript');
            session.fileId = id;

            session.on('change', () => {
                file.contentBuffer = session.getValue();
                const fileTreeComponent = this.params!.components.get(FileTree.name) as FileTree;
                fileTreeComponent.update();
            });

            this.sessions.set(id, session);
            this.editor.setSession(session);
            return;
        }

        this.editor.setSession(this.sessions.get(id));
    }

    public toggleSettings() {
        this.settingsPanel?.classList.toggle('hidden');
    }
}

export { Editor };
