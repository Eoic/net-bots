class Component {
    private _state: any = {};

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

export { Component };