export class Menu {
    //有bug，宣告矩陣塞資料後，屬性第一字母會自動變小寫menuText這樣！html打MenuText反而找不到...
    menuId?: number;
    path?: string;
    menuText?: string;
    sortNo?: number;
    selector?: string;
    component?: string;
    rootMenuId?: number;
    appId?: number;
}

export class MenuNode {
    menuText: string;
    menuId: number;
    children: MenuNode[];
}

export class MenuFlatNode {
    constructor(
        public menuText: string,
        public menuId: number,
        public level: number,
        public expandable: boolean,
    ) { }
}