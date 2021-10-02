class Component {
    private _state: any = {};
    protected params: ComponentParameters | undefined;

    constructor(params?: ComponentParameters) {
        this.params = params;
    }

    public get state() {
        return Object.freeze(this._state);
    }

    public set state(value: any) {
        this._state = { ...value };
    }

    public setState(newStateSlice: any) {
        this._state = { ...this.state, ...newStateSlice };
    }
}

class ComponentParameters {
    public components: Map<string, Component> = new Map();
}

export { Component, ComponentParameters };
