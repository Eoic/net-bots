// import { Events } from '../events';
import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

// import { EventManager } from '../../core/managers/event-manager';

class Editor {
    private editor: any;

    constructor() {
        this.editor = ace.edit('editor');
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
        });
        this.editor.setTheme('ace/theme/pastel_on_dark');
        this.editor.session.setMode('ace/mode/javascript');
        this.editor.session.setValue('');
        // this.editor.onUpdate((code: string) => EventManager.dispatch(Events.CODE_UPDATE, { code }));
    }

    public updateCode(content: string) {
        this.editor.session.setValue(content);
    }
}

export { Editor };
