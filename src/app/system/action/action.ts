export class Action {
    //有bug，宣告矩陣塞資料後，屬性第一字母會自動變小寫menuText這樣！html打MenuText反而找不到...
    public id: number;
    public name: string;
    public method: string;
    public controllerId: number;
    public description?: string=null;    
}

export class Ctrl {
    //有bug，宣告矩陣塞資料後，屬性第一字母會自動變小寫menuText這樣！html打MenuText反而找不到...
    public ctrlId: number;
    public name: string;
    public description?: string;
    public appId?:number;

    constructor(ctrlId, name) {
        this.ctrlId = ctrlId;
        this.name = name;
    }
}