//老bug，宣告矩陣塞資料後，屬性第一字母會自動變小這樣！
export class RoleGroup {
    public roleId?: number;
    public roleName: string;
    public sortNo?: number;
    public accessScope?: number;
    public description?: string;
    public parentRoleId?: number;
    public rejectScope?: boolean;
    public approveScope?: boolean;
    public submitScope?: boolean;
    public passScope?: boolean;
    public printScope?: boolean;
}

export class ImenuRole {
    public menuId: number;
    public roleId: number;
}