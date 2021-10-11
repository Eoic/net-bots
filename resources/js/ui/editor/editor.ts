import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import { EventManager } from '../../core/managers/event-manager';
import { Component, ComponentParameters } from '../core/component';
import { Events } from '../events';
import { EditorOption } from './editor-option';
import { FileNode, FileTree } from './file-tree';

const EditorOptions = [
    new EditorOption('theme', ['ace/theme/pastel_on_dark', 'ace/theme/monokai']),
    new EditorOption('selectionStyle', ['line', 'text']),
    new EditorOption('highlightActiveLine', []),
    new EditorOption('highlightSelectedWord', []),
    new EditorOption('readOnly', []),
    new EditorOption('cursorStyle', ['ace', 'slim', 'smooth', 'wide']),
    new EditorOption('mergeUndoDeltas', ['true', 'false', 'always']),
    new EditorOption('behavioursEnabled', []),
    new EditorOption('wrapBehavioursEnabled', []),
    new EditorOption('autoScrollEditorIntoView', []),
    new EditorOption('copyWithEmptySelection', []),
    new EditorOption('useSoftTabs', []),
    new EditorOption('navigateWithinSoftTabs', []),
    new EditorOption('enableMultiselect', []),
];

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
        this.settingsPanel && this.renderEditorOptions(this.settingsPanel);

        EventManager.on(Events.UPDATE_EDITOR_OPTION, (event: any) => {
            if (!event) return;
            this.editor.setOption(event.name, event.value);
        });

        console.log(this.editor.getOptions());
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

    public setSettingsDisplay(isVisible) {
        if (isVisible) this.settingsPanel?.classList.remove('hidden');
        else this.settingsPanel?.classList.add('hidden');
    }

    public renderEditorOptions(settingsPanel: HTMLElement) {
        const optionsContainer = document.createElement('div');
        settingsPanel.appendChild(optionsContainer);

        /** Temp */
        optionsContainer.style.display = 'grid';
        optionsContainer.style.rowGap = '4px';
        /* --- */

        EditorOptions.forEach((option: EditorOption) => {
            const optionLabel = document.createElement('label');
            const optionValue = this.editor.getOption(option.name);
            optionLabel.classList.add('flex');

            if (Array.isArray(option.choices)) {
                const optionTemplate = (choice) => `
                    <option value=${choice} ${choice === optionValue && 'selected'}>
                        ${choice}
                    </option>
                `.trim();

                optionLabel.innerHTML = `
                    ${String.humanize(option.name)}
                    <select name='${option.name}'>
                        ${option.choices.map((choice) => optionTemplate(choice)).join('')}
                    </select>
                `.trim();
            } else if (Boolean.isBoolean(option.choices)) {
                optionLabel.innerHTML = `
                    ${String.humanize(option.name)}
                    <input type='checkbox' name='${option.name}' ${optionValue === true && 'checked'}>
                `.trim();
            }

            optionLabel.firstElementChild?.addEventListener('change', (event) => {
                const input = event.target as HTMLElement;

                EventManager.dispatch(Events.UPDATE_EDITOR_OPTION, {
                    name: input.getAttribute('name'),
                    value: input.tagName === 'SELECT' ? (input as HTMLSelectElement).value : (input as HTMLInputElement).checked,
                });
            });

            optionsContainer.appendChild(optionLabel);
        });
    }
}

export { Editor };
