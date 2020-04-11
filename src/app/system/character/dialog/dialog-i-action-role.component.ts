import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleGroup } from '../../../../interface/system_auth/role_group';
import { IActionRole } from '../../../../interface/system_auth/i_action_role';
import { ActionNode, ActionFlatNode, } from '../../../../interface/system_auth/vm_i_role';
import { IActionRoleService } from '../../../../api/system_auth/i_action_role.service';

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable, of as observableOf } from 'rxjs';

@Component({
    selector: 'dialog-i-action-role',
    templateUrl: 'dialog-i-action-role.html',
    providers: [IActionRoleService],
})

export class DialogIActionRoleComponent implements OnInit {

    roleDetail: RoleGroup;
    iActionRoleList: IActionRole[];
    allowedAction: IActionRole[] = [];
    treeAction: ActionNode[] = [];

    /** Parameters of MatTreeFlatDataSource */
    treeControl: FlatTreeControl<ActionFlatNode>;
    treeFlattener: MatTreeFlattener<ActionNode, ActionFlatNode>;
    dataSource: MatTreeFlatDataSource<ActionNode, ActionFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<ActionFlatNode>(true /* multiple */);

    /** Parameters of MatTreeFlattener */
    private _getLevel = (node: ActionFlatNode) => node.level;
    private _isExpandable = (node: ActionFlatNode) => node.expandable;
    private _getChildren = (node: ActionNode): Observable<ActionNode[]> => observableOf(node.children);
    hasChild = (_: number, _nodeData: ActionFlatNode) => _nodeData.expandable;

    constructor(
        public dialogRef: MatDialogRef<DialogIActionRoleComponent>,
        private iActionRoleService: IActionRoleService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.roleDetail = data[0];
        this.iActionRoleList = data[1];
        this.treeAction = data[2];

        this.treeFlattener = new MatTreeFlattener(
            this.transformer,
            this._getLevel,
            this._isExpandable,
            this._getChildren
        );
        this.treeControl = new FlatTreeControl<ActionFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSource.data = this.treeAction;
    }

    transformer = (node: ActionNode, level: number) => {
        return new ActionFlatNode(node.name, node.id, node.method, level, !!node.children);
    }

    ngOnInit() {
        /** 取出角色清單可用Memu清單
         *  先將database該角色資料show on the tree  */
        this.iActionRoleList.filter(x => x.roleId === this.roleDetail.roleId).forEach(y => {
            this.allowedAction.push(y);
            this.checklistSelection.select(
                this.treeControl.dataNodes.find(x => x.id === y.actionId && x.level === 1)
            );
        });
    }

    /** Whether all the descendants of the node are selected */
    descendantsAllSelected(node: ActionFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every(child => this.checklistSelection.isSelected(child));
    }

    /** 只要有任一child被選取則check=true*/
    descendantsPartiallySelected(node: ActionFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));

        // 只要有選到child或從DB抓來資料是已selected，就自動select parent
        if (result || this.checklistSelection.isSelected(node)) {
            this.checklistSelection.select(node);
        } else {
            this.checklistSelection.deselect(node);
        }

        return (result && !this.descendantsAllSelected(node))
            || this.checklistSelection.isSelected(node);
    }

    /** Check item selection. Select/deselect all the descendants node */
    checkParentSelection(node: ActionFlatNode): void {

        /** toggle在某些太難判斷情況，用select/deselect分開處理
         * 只要有選到child或本來就已selected，就自動select parent */
        // this.checklistSelection.toggle(node);

        const descendants = this.treeControl.getDescendants(node); // 抓底下所有child

        if (!this.checklistSelection.isSelected(node)) {
            this.checklistSelection.select(...descendants); // 選取所有child
            this.checklistSelection.select(node);
        } else {
            this.checklistSelection.deselect(...descendants); // 取消所有child
            this.checklistSelection.deselect(node);
        }
    }

    /** Whether part of the descendants are selected */
    /** 再背景一直抓一直抓一直抓的偵測... */
    indeterminateSelected(node: ActionFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    onNoClick() {
        this.dialogRef.close(false);
    }

    onYesClick() {

        const originActionIds: number[] = [];
        const newActionIds: number[] = [];

        // 拉出來做一個只含menuId的array，抓出原來的權限
        this.allowedAction.forEach(action => {
            originActionIds.push(action.actionId);
        });
        // level 0 are controllers list, level 1 are actions.因此篩選出勾選的level 1即可
        this.checklistSelection.selected.filter(x => x.level === 1).forEach(action => {
            newActionIds.push(action.id);
        });

        /** 交集*/
        // let Intersection = OriginMenuIds.filter(v => NewMenuIds.includes(v));
        // subtracting
        const subtractingOfOrigin = originActionIds.filter(v => !newActionIds.includes(v));
        const subtractingOfNew = newActionIds.filter(v => !originActionIds.includes(v));

        /** do nothing at 交集 Intersection */
        // if( Intersection ){
        //     console.log(Intersection);
        // }

        /** delete at SubtractingOfOrigin */
        subtractingOfOrigin.forEach(actionId =>
            this.deleteactionRole(this.roleDetail.roleId, actionId)
        );

        /** insert at SubtractingOfNew */
        subtractingOfNew.forEach(actionId =>
            this.postIactionRole(this.roleDetail.roleId, actionId)
        );

        this.dialogRef.close(true);
    }

    postIactionRole(roleId: number, actionId: number) {
        const data: IActionRole = {
            roleId: roleId,
            actionId: actionId,
        };
        this.iActionRoleService.postIActionRole(data).subscribe((result: any) => {
            // console.log(result);
        }, (error) => {
            console.log(error);
        });
    }

    deleteactionRole(roleId: number, actionId: number) {
        this.iActionRoleService.deleteIActionRole(actionId, roleId).subscribe((result: any) => {
            // console.log(result);
        }, (error) => {
            console.log(error);
        });
    }
}
