class Component extends HTMLElement {
    private _state: any = {};
    private _template: HTMLTemplateElement;

    public get state() {
        return Object.freeze(this._state);
    }

    public set state(value: any) {
        this._state = { ...value };
    }

    public get template() {
        return this._template;
    }

    public set template(value: HTMLTemplateElement) {
        this._template = value;
    }

    public setState(newStateSlice: any) {
        this._state = { ...this.state, ...newStateSlice };
        // TODO: Update component?
    }

    constructor(templateString: string) {
        super();
        this.attachShadow({ mode: 'open' });
        this.template = document.createElement('template');
        this.template.innerHTML = templateString;
        this.shadowRoot!.appendChild(this.template.content.cloneNode(true));
    }
}

export { Component };
