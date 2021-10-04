import { Component } from '../core/component';
import { DefaultFileTreeWidth, DrawerXWidth, ToolbarWidth, PanelSnapDistance, DefaultPanelHeight } from '../constants';
import { Editor } from './editor';

const GridColumnsTemplate = (width: number = DefaultFileTreeWidth) => `${width}px 1fr`;

enum Direction {
    None = 'None',
    X = 'X',
    Y = 'Y',
}

class EditorPanel extends Component {
    private drawerY: HTMLElement | null | undefined;
    private drawerX: HTMLElement | null | undefined;
    private panel: HTMLElement | null | undefined;
    private drawerYHeight: number;
    private panelButtons: NodeListOf<Element>;
    private panelTabsMap: Map<string, any>;
    private codeEditorPanel: HTMLElement | null;
    private consolePanel: HTMLElement | null;
    private devToolsPanel: HTMLElement | null;

    constructor(params) {
        super();
        this.params = params;
        this.setState({
            isResizing: false,
            canResizeX: false,
            canResizeY: false,
            activeTab: 'tab-0',
        });

        this.panel = document.getElementById('panel');
        this.panelButtons = document.querySelectorAll('button[data-tab]');
        this.codeEditorPanel = document.getElementById('code-editor');
        this.consolePanel = document.getElementById('console');
        this.devToolsPanel = document.getElementById('dev-tools');
        this.panelTabsMap = new Map([
            ['tab-0', { tab: this.codeEditorPanel, handleTabSwitch: () => {} }],
            ['tab-1', { tab: this.consolePanel, handleTabSwitch: () => this.handleConsoleTabSwitch() }],
            ['tab-2', { tab: this.devToolsPanel, handleTabSwitch: () => {} }],
        ]);
        this.drawerX = document.getElementById('drawer-vertical');
        this.drawerY = document.getElementById('drawer-horizontal');
        this.drawerYHeight = parseInt(window.getComputedStyle(this.drawerY as Element)['height']);
        this.loadUserPrefs();
        this.bindEvents();
    }

    private bindEvents() {
        window.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        window.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        window.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        window.addEventListener('resize', (event) => this.handleWindowResize(event));
        this.drawerY?.addEventListener('mouseenter', (event) => this.handleMouseEnter(event, Direction.Y));
        this.drawerY?.addEventListener('mouseleave', (event) => this.handleMouseLeave(event, Direction.Y));
        this.drawerX?.addEventListener('mouseenter', (event) => this.handleMouseEnter(event, Direction.X));
        this.drawerX?.addEventListener('mouseleave', (event) => this.handleMouseLeave(event, Direction.X));
        this.panelButtons.forEach((button) => {
            button.addEventListener('click', (event: MouseEvent) => this.handleTabSelect(event));
        });
    }

    private handleTabSelect(event: MouseEvent) {
        const selectedTab = (event.target as HTMLElement).dataset.tab;

        this.panelButtons.forEach((button: HTMLElement) => {
            if (button.dataset.tab !== selectedTab) {
                button.classList.remove('active');
                const panelData = this.panelTabsMap.get(button.dataset.tab || '');
                panelData?.tab.classList.add('hidden');
                panelData?.handleTabSwitch();
            } else {
                button.classList.add('active');
            }
        });

        const panelData = this.panelTabsMap.get(selectedTab || '');
        panelData?.tab.classList.remove('hidden');
        panelData?.handleTabSwitch();
    }

    private handleMouseDown(event: MouseEvent) {
        let isResizing = true;
        let resizeDirection = Direction.None;
        const targetNode = event.target as Node;

        if (this.state.canResizeX && this.drawerX?.isEqualNode(targetNode)) {
            resizeDirection = Direction.X;
        } else if (this.state.canResizeY && this.drawerY?.isEqualNode(targetNode)) {
            resizeDirection = Direction.Y;
        } else isResizing = false;

        this.codeEditorPanel!.style.userSelect = 'none';
        this.setState({ isResizing, resizeDirection });
    }

    private handleMouseUp(_event: MouseEvent) {
        this.setState({ isResizing: false });
        this.codeEditorPanel!.style.userSelect = 'initial';
        localStorage.setItem('panelHeight', `${this.panel?.style.height}`);
    }

    private handleMouseMove(event: MouseEvent) {
        if (!this.state.isResizing) return;

        if (this.state.resizeDirection === Direction.X) {
            if (!this.codeEditorPanel) return;
            let newWidth = event.pageX;

            if (event.pageX >= window.innerWidth - PanelSnapDistance) {
                newWidth = window.innerWidth - DrawerXWidth / 2;
            } else if (event.pageX <= ToolbarWidth + PanelSnapDistance) {
                newWidth = ToolbarWidth;
            }

            (this.params as any).components.get(Editor.name).editor.resize();
            this.codeEditorPanel.style.gridTemplateColumns = GridColumnsTemplate(newWidth);
        } else if (this.state.resizeDirection === Direction.Y) {
            let position = window.innerHeight - event.pageY + this.drawerYHeight / 2;

            if (position < this.drawerYHeight + PanelSnapDistance) {
                position = this.drawerYHeight;
            }

            if (event.pageY < this.drawerYHeight / 2 + PanelSnapDistance) {
                position = window.innerHeight;
            }

            (this.params as any).components.get(Editor.name).editor.resize();
            this.panel!.style.height = position + 'px';
        }
    }

    private handleMouseEnter(_event: MouseEvent, direction: string) {
        this.setState({ [`canResize${direction}`]: true });
    }

    private handleMouseLeave(_event: MouseEvent, direction: string) {
        this.setState({ [`canResize${direction}`]: false });
    }

    private handleWindowResize(_event: Event) {
        if (parseInt(window.getComputedStyle(this.panel as Element)['height']) > window.innerHeight) {
            this.panel!.style.height = `${window.innerHeight}px`;
            localStorage.setItem('panelHeight', `${this.panel?.style.height}`);
        }
    }

    private loadUserPrefs() {
        this.panel!.style.height = localStorage.getItem('panelHeight') || `${DefaultPanelHeight}px`;
    }

    private handleConsoleTabSwitch() {
        const commandInputNode = document.getElementById('command-input') as HTMLInputElement;
        commandInputNode?.focus();
        commandInputNode?.select();
    }

    public setMinFileTreeWidth() {
        if (!this.codeEditorPanel) return;

        const columnTokens = window.getComputedStyle(this.codeEditorPanel).getPropertyValue('grid-template-columns').split(' ');
        const currentWidth = parseInt(columnTokens[0]);

        if (isNaN(currentWidth) || currentWidth >= DefaultFileTreeWidth) {
            return;
        }

        this.codeEditorPanel.style.gridTemplateColumns = GridColumnsTemplate(DefaultFileTreeWidth);
    }
}

export { EditorPanel };
