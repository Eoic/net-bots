/**
 * Maps name to the decorated component.
 * @param tagName Name of the component in HTML file.
 */
const Tag = (tagName: string) => {
    return (constructor: Function) => {
        window.customElements.define(tagName, constructor as CustomElementConstructor);
    };
};

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
    }

    constructor(templateString?: string) {
        super();
        this.attachShadow({ mode: 'open' });
        this.template = document.createElement('template');

        if (this.template) {
            this.template.innerHTML = templateString as string;
        } else {
            this.template = document.createElement('template');
            this.template.innerHTML = '';
        }

        this.shadowRoot!.appendChild(this.template.content.cloneNode(true));
    }
}

export { Component, Tag };
