export class Ctrl {
     ctrlId: number;
     name: string;
     description?: string;
     appId?: number;

    constructor(ctrlId: number, name: string) {
        this.ctrlId = ctrlId;
        this.name = name;
    }
}
