import { Component } from '../core/component';

const GridColumnsTemplate = (width: number = 240) => `${width}px 1px 1fr`;

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
    private panelTabsMap: Map<string, HTMLElement | null>;
    private editorNode: HTMLElement;
    private codeEditorPanel: HTMLElement | null;
    private consolePanel: HTMLElement | null;

    constructor() {
        super();
        this.setState({
            isResizing: false,
            canResizeX: false,
            canResizeY: false,
            activeTab: 'tab-0',
        });
        this.editorNode = document.getElementById('editor') as HTMLElement;
        this.panel = document.getElementById('panel');
        this.panelButtons = document.querySelectorAll('button[data-tab]');
        this.codeEditorPanel = document.getElementById('code-editor');
        this.consolePanel = document.getElementById('console');
        this.panelTabsMap = new Map([
            ['tab-0', this.codeEditorPanel],
            ['tab-1', this.consolePanel],
        ]);
        this.drawerX = this.appendDrawerX();
        this.drawerY = document.getElementById('drawer');
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

    private appendDrawerX() {
        const drawer = document.createElement('div');
        drawer.classList.add('drawer-vertical');
        this.editorNode.appendChild(drawer);
        return drawer;
    }

    private handleTabSelect(event: MouseEvent) {
        const selectedTab = (event.target as HTMLElement).dataset.tab;

        this.panelButtons.forEach((button: HTMLElement) => {
            if (button.dataset.tab !== selectedTab) {
                button.classList.remove('active');
                this.panelTabsMap.get(button.dataset.tab || '')?.classList.add('hidden');
            } else {
                button.classList.add('active');
            }
        });

        this.panelTabsMap.get(selectedTab || '')?.classList.remove('hidden');
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

        this.setState({ isResizing, resizeDirection });
    }

    private handleMouseUp(_event: MouseEvent) {
        this.setState({ isResizing: false });
        localStorage.setItem('panelHeight', `${this.panel?.style.height}`);
    }

    private handleMouseMove(event: MouseEvent) {
        if (!this.state.isResizing) return;

        if (this.state.resizeDirection === Direction.X) {
            if (!this.codeEditorPanel) return;
            let newWidth = event.pageX;

            if (event.pageX >= window.innerWidth) {
                newWidth = window.innerWidth - 3;
            } else if (event.pageX <= 42) {
                newWidth = 42;
            }

            this.codeEditorPanel.style.gridTemplateColumns = GridColumnsTemplate(newWidth);
        } else if (this.state.resizeDirection === Direction.Y) {
            let position = window.innerHeight - event.pageY + this.drawerYHeight / 2;

            if (position < this.drawerYHeight) {
                position = this.drawerYHeight;
            }

            if (event.pageY < this.drawerYHeight / 2) {
                position = window.innerHeight;
            }

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
        this.panel!.style.height = localStorage.getItem('panelHeight') || '250px';
    }
}

export { EditorPanel };
