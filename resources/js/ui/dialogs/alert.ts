import { Component } from '../core/component';

const AlertTemplate = (title: string, body: string) => `
    <div class='overlay center hidden'>
        <div class='alert' autofocus>
            <div class='alert-title'>${title}</div>
            <div class='alert-body'>${body}</div>
            <div class='actions'>
                <button id='alert-cancel' class='btn round'> Cancel </button>
                <button id='alert-confirm' class='btn round danger'> Confirm </button>
            </div>
        </div>
    </div>
`;

class Alert extends Component {
    private alertNode: HTMLElement | null;

    constructor() {
        super();
        this.alertNode = this.createElement('', '');
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                this.hide();
            }
        });
        document.body.appendChild(this.alertNode);
    }

    public createElement(title: string, body: string) {
        const alertNodeTemplate = document.createElement('template');
        alertNodeTemplate.innerHTML = AlertTemplate(title, body);
        return alertNodeTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    }

    public async show(title: string, body: string) {
        if (!this.alertNode) return;
        this.alertNode.innerHTML = this.createElement(title, body).innerHTML;
        this.alertNode.classList.remove('hidden');

        return new Promise<void>((fulfill) => {
            (this.alertNode?.querySelector('#alert-confirm') as HTMLButtonElement).addEventListener('click', () => {
                fulfill();
                this.hide();
            });

            (this.alertNode?.querySelector('#alert-cancel') as HTMLButtonElement).addEventListener('click', () => this.hide());
        });
    }

    public hide() {
        if (!this.alertNode) return;
        this.alertNode.classList.add('hidden');
    }
}

export { Alert };
