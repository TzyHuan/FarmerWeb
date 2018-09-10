import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Member } from '../member';
import { ImemRole, RoleGroupNode, RoleGroupFlatNode } from '../../character/character';
import { ImemRoleService } from '../../character/character.service';

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'dialog-ImemRole',
    templateUrl: 'dialog-ImemRole.html',
    providers: [ImemRoleService]
})
export class DialogImemRoleComponent implements OnInit {

    public MemberDetial: Member;
    public ImemRoleList: ImemRole[];
    public AllowedRole: ImemRole[] = [];
    public TreeRole: RoleGroupNode[] = [];

    /** Parameters of MatTreeFlatDataSource */
    treeControl: FlatTreeControl<RoleGroupFlatNode>;
    treeFlattener: MatTreeFlattener<RoleGroupNode, RoleGroupFlatNode>;
    dataSource: MatTreeFlatDataSource<RoleGroupNode, RoleGroupFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<RoleGroupFlatNode>(true /* multiple */);

    /** Parameters of MatTreeFlattener */
    private _getLevel = (node: RoleGroupFlatNode) => node.level;
    private _isExpandable = (node: RoleGroupFlatNode) => node.expandable;
    private _getChildren = (node: RoleGroupNode): Observable<RoleGroupNode[]> => of(node.children);
    hasChild = (_: number, _nodeData: RoleGroupFlatNode) => _nodeData.expandable;

    constructor(public dialogRef: MatDialogRef<DialogImemRoleComponent>,
        private ImemRoleREST: ImemRoleService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.MemberDetial = data[0];
        this.ImemRoleList = data[1];
        this.TreeRole = data[2];

        this.treeFlattener = new MatTreeFlattener(
            this.transformer,
            this._getLevel,
            this._isExpandable,
            this._getChildren
        );
        this.treeControl = new FlatTreeControl<RoleGroupFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSource.data = this.TreeRole;
    }

    transformer = (node: RoleGroupNode, level: number) => {
        return new RoleGroupFlatNode(node.name, node.id, level, !!node.children);
    }

    ngOnInit() {
        /** 取出角色清單可用Memu清單 
         *  先將database該角色資料show on the tree  */
        this.ImemRoleList.filter(x => x.account == this.MemberDetial.account).forEach(y => {
            this.AllowedRole.push(y);
            this.checklistSelection.select(
                this.treeControl.dataNodes.find(x => x.id == y.roleId)
            )
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(): void {

        let OriginActionIds: number[] = [];
        let NewActionIds: number[] = [];

        // 拉出來做一個只含menuId的array，抓出原來的權限
        this.AllowedRole.forEach(role => {
            OriginActionIds.push(role.roleId);
        });
        //level 0 are controllers list, level 1 are actions.因此篩選出勾選的level 1即可
        this.checklistSelection.selected.forEach(role => {
            NewActionIds.push(role.id);
        });

        /** 交集*/
        // subtracting
        let SubtractingOfOrigin = OriginActionIds.filter(v => !NewActionIds.includes(v));
        let SubtractingOfNew = NewActionIds.filter(v => !OriginActionIds.includes(v));

        /** delete at SubtractingOfOrigin */
        if (SubtractingOfOrigin.length > 0) {
            SubtractingOfOrigin.forEach(roleId =>
                this.DeleteactionRole(this.MemberDetial.account, roleId)
            );
        }

        /** insert at SubtractingOfNew */
        if (SubtractingOfNew.length > 0) {
            SubtractingOfNew.forEach(roleId =>
                this.PostIactionRole(this.MemberDetial.account, roleId)
            );
        }

        this.dialogRef.close(true);
    }

    PostIactionRole(account: string, roleId: number) {
        let data: ImemRole = {
            account: account,
            roleId: roleId
        }
        this.ImemRoleREST.PostImemRole(data).subscribe(
            (result: any) => {
                //console.log(result);
            },
            error => {
                console.log(error);
            }
        )
    }

    DeleteactionRole(account: string, roleId: number) {
        this.ImemRoleREST.DeleteImemRole(account, roleId).subscribe(
            (result: any) => {
                //console.log(result);
            },
            error => {
                console.log(error);
            }
        )
    }
}
