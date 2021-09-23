import { EventManager } from '../../core/managers/event-manager';
import { Component } from '../core/component';
import { Events } from '../events';

class DebugInfo {
    public section: string;
    public label: {
        title: string;
        value: string;
        status?: 'success' | 'warning' | 'error';
    };

    constructor(section: string, label: { title: string; value: string; status?: 'success' | 'warning' | 'error' }) {
        this.section = section;
        this.label = label;
    }
}

class DevTools extends Component {
    private sections: Map<string, Map<string, { value: string; status: string }>>;
    private devToolsNode: HTMLElement | null;

    constructor() {
        super();
        this.sections = new Map();
        this.devToolsNode = document.getElementById('dev-tools');

        EventManager.on(Events.DEBUG_INFO_UPDATE, (event: DebugInfo) => {
            const labelsMap = this.sections.get(event.section) || new Map();
            labelsMap.set(event.label.title, { value: event.label.value, status: event.label.status });
            this.sections.set(event.section, labelsMap);
            this.update();
        });
    }

    private update() {
        if (!this.devToolsNode) return;

        this.devToolsNode.innerHTML = '';

        this.sections.forEach((labels, sectionTitle) => {
            const sectionHeaderNode = document.createElement('h5');
            const sectionNode = document.createElement('div');
            const sectionContent = document.createElement('div');
            sectionHeaderNode.classList.add('dev-header');
            sectionNode.classList.add('dev-section');
            sectionHeaderNode.textContent = sectionTitle;
            sectionNode.appendChild(sectionHeaderNode);
            this.devToolsNode?.appendChild(sectionNode);

            labels.forEach((labelData, labelTitle) => {
                const labelTitleNode = document.createElement('p');
                const labelValueNode = document.createElement('p');
                labelTitleNode.textContent = labelTitle;
                labelValueNode.textContent = labelData.value;

                if (labelData.status) {
                    labelValueNode.classList.add(labelData.status);
                }

                sectionContent.appendChild(labelTitleNode);
                sectionContent.appendChild(labelValueNode);
            });

            sectionNode.appendChild(sectionContent);
        });
    }
}

export { DevTools, DebugInfo };
