export class Menu {
    //有bug，宣告矩陣塞資料後，屬性第一字母會自動變小寫menuText這樣！html打MenuText反而找不到...
    public menuId?: number;
    public path?: string;
    public menuText?: string;
    public sortNo?: number;
    public component?: string;
    public rootMenuId?: number;   
}