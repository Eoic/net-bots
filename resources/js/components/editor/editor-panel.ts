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

        if (localStorage.getItem('panelHeight')) {
            this.panel!.style.height = localStorage.getItem('panelHeight') || '250px';
        }

        this.bindEvents();
    }

    private bindEvents() {
        window.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        window.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        window.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        window.addEventListener('resize', (event) => this.handleWindowResize(event));
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
        localStorage.setItem('panelHeight', `${this.panel?.style.height}`);
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

    private handleWindowResize(_event: Event) {
        if (parseInt(window.getComputedStyle(this.panel as Element)['height']) > window.innerHeight) {
            this.panel!.style.height = `${window.innerHeight}px`;
            localStorage.setItem('panelHeight', `${this.panel?.style.height}`);
        }
    }
}

export { EditorPanel };
