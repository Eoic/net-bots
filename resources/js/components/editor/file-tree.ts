import { Component } from '../core/component';

const template = `
    <style>
        button {
            position: fixed;
        }
    </style>

    <button id='counter' value='0'>
        FileTree <slot name='value'></slot>
    </button>
`;

type Count = {
    count: number;
};

class FileTree extends Component {
    private counterDisplay: any;

    public static get observedAttributes() {
        return ['value'];
    }

    constructor() {
        super(template);
        this.state = <Count>{ count: 0 };
        this.bindEvents();
    }

    private bindEvents() {
        const counter = this.shadowRoot?.getElementById('counter');
        this.counterDisplay = this.shadowRoot?.querySelector('#counter');

        counter?.addEventListener('click', () => {
            this.setState({ count: this.state.count + 1 });
            this.setAttribute('value', `${this.state.count}`);
            console.log(this.state.count);
        });
    }

    public attributeChangedCallback(_name, _oldValue, newValue) {
        this.counterDisplay.innerHTML = newValue;
    }
}

window.customElements.define('file-tree', FileTree);
export { FileTree };
