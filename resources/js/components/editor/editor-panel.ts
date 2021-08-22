import { Component } from '../core/component';

class EditorPanel extends Component {
    private drawer: HTMLElement | null | undefined;
    private panel: HTMLElement | null | undefined;
    private drawerHeight: number;

    constructor() {
        super();
        this.setState({ isResizing: false });
        this.drawer = document.getElementById('drawer');
        this.drawerHeight = parseInt(window.getComputedStyle(this.drawer as Element)['height']);
        this.panel = document.getElementById('panel');
        this.bindEvents();
    }

    private bindEvents() {
        window.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        window.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        window.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.drawer?.addEventListener('mouseenter', (event) => this.handleMouseEnter(event));
        this.drawer?.addEventListener('mouseleave', (event) => this.handleMouseLeave(event));
    }

    private handleMouseDown(event: MouseEvent) {
        if (this.state.canResize && this.drawer?.isEqualNode(event.target as Node)) {
            this.setState({ isResizing: true });
        }
    }

    private handleMouseUp(_event: MouseEvent) {
        this.setState({ isResizing: false });
    }

    private handleMouseMove(event: MouseEvent) {
        if (!this.state.isResizing) return;

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

export { EditorPanel };
