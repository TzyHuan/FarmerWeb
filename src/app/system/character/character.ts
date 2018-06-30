export class RoleGroup {
    public RoleId: number;
    public RoleName: string;
    public SortNo: number;
    public AccessScope: number;
    public Description?: string;
    public ParentRoleId?: number;
    public RejectScope: boolean;
    public ApproveScope: boolean;
    public publicSubmitScope: boolean;
    public PassScope: boolean;
    public PrintScope: boolean;
}

export class ImenuRole {
    public MenuId: number;
    public RoleId: number;
}

export class ImemRole {
    public Account: string;
    public RoleId: number;
}