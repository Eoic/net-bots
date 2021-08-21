import { Component, Tag } from '../core/component';

const template = `
    <link rel='stylesheet' href='http://localhost:8080/assets/app.css'>

    <div class='panel' id='panel'>
        <div id='drawer' class='panel-drawer'>
            <button class="tab btn"> Editor </button>
            <button class="tab btn"> Console </button>
        </div>
        <div class='panel-grid'>
            <slot name='file-tree'></slot>
            <slot name='editor'></slot>
        </div>
    </div>
`;

@Tag('scripting-panel')
class ScriptingPanel extends Component {
    private drawer: HTMLElement | null | undefined;
    private panel: HTMLElement | null | undefined;
    private drawerHeight: number;

    constructor() {
        super(template);
        this.setState({ isResizing: false });
        this.drawer = this.shadowRoot?.getElementById('drawer');
        this.drawerHeight = parseInt(window.getComputedStyle(this.drawer as Element)['height']);
        this.panel = this.shadowRoot?.getElementById('panel');
        this.bindEvents();
    }

    private bindEvents() {
        window.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        window.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        window.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.drawer?.addEventListener('mouseenter', (event) => this.handleMouseEnter(event));
        this.drawer?.addEventListener('mouseleave', (event) => this.handleMouseLeave(event));
    }

    private handleMouseDown(_event: MouseEvent) {
        if (this.state.canResize) {
            this.setState({ isResizing: true });
        }
    }

    private handleMouseUp(_event: MouseEvent) {
        this.setState({ isResizing: false });
    }

    private handleMouseMove(event: MouseEvent) {
        if (!this.state.isResizing) return;

        console.log(this.drawerHeight);

        let position = window.innerHeight - event.pageY + this.drawerHeight / 2;

        if (position < this.drawerHeight) {
            position = this.drawerHeight;
        }

        if (event.pageY < this.drawerHeight / 2) {
            position = window.innerHeight;
        }

        this.panel!.style.height = position + 'px';
    }

    private handleMouseEnter(_event: MouseEvent) {
        this.setState({ canResize: true });
    }

    private handleMouseLeave(_event: MouseEvent) {
        this.setState({ canResize: false });
    }
}

export { ScriptingPanel };
