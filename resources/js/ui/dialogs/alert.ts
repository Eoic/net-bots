import { Component } from '../core/component';

const AlertTemplate = (title: string, body: string, type: string, icon: string) => `
    <div class='overlay center hidden' tabindex='0'>
        <div class='alert ${type}' autofocus>
            <div class='content'>
                <i class='fas fa-${icon}'></i>
                <div>
                    <div class='alert-title'> ${title} </div>
                    <div class='alert-body'> <p>${body}</p> </div>
                </div>
            </div>

            <div class='actions'>
                <button id='alert-cancel' class='btn light round'> Cancel </button>
                <button id='alert-confirm' class='btn round'> Confirm </button>
            </div>
        </div>
    </div>
`;

class Alert extends Component {
    private alertNode: HTMLElement | null;

    constructor() {
        super();
        this.alertNode = this.createElement('', '', '', '');
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                this.hide();
            }
        });
        document.body.appendChild(this.alertNode);
    }

    public createElement(title: string, body: string, type: string, icon: string) {
        const alertNodeTemplate = document.createElement('template');
        alertNodeTemplate.innerHTML = AlertTemplate(title, body, type, icon);
        return alertNodeTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    }

    public async show(title: string, body: string, type: string = '', icon: string = 'info-circle') {
        if (!this.alertNode) return;
        this.alertNode.innerHTML = this.createElement(title, body, type, icon).innerHTML;
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
