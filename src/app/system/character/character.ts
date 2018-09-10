import { Action, Ctrl } from '../action/action'

//老bug，宣告矩陣塞資料後，屬性第一字母會自動變小這樣！
export class RoleGroup {
    public roleId?: number;
    public roleName?: string;
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

export class IactionRole {
    public actionId: number;
    public roleId: number;
}

export class ImemRole {
    public account: string;
    public roleId: number;
}

export class ActionNode extends Ctrl {
    public children: ActionNode[]
    public method: string
    public id: number
    public name:string    
}

export class ActionFlatNode {
    constructor(
        public name: string,
        public id: number,
        public method: string,
        public level: number,
        public expandable: boolean
    ) { }
}

export class RoleGroupNode {
    public id: number;
    public name: string;
    public children: RoleGroupNode[];
}

export class RoleGroupFlatNode {
    constructor(
        public name: string,
        public id: number,
        public level: number,
        public expandable: boolean
    ) { }
}