class EditorOption {
    public readonly name: string;
    public readonly choices: boolean | string[];
    // public readonly defaultChoice: boolean | string;

    constructor(name: string, choices: boolean | string[]/*, defaultChoice: boolean | string*/) {
        this.name = name;
        this.choices = Array.isArray(choices) && choices.length > 0 ? choices : true;
        // this.defaultChoice = defaultChoice;
    }
}

export { EditorOption };
