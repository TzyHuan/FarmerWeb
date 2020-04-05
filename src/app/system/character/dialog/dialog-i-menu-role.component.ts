import { Component, Inject, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable, of as observableOf } from 'rxjs';
import { RoleGroup } from '../../../../interface/system_auth/role_group';
import { IMenuRole } from '../../../../interface/system_auth/i_menu_role';
import { MenuNode, MenuFlatNode } from '../../../../interface/system_auth/menu';
import { IMenuRoleService } from '../../../../api/system_auth/i_menu_role.service';

@Component({
    selector: 'dialog-i-menu-role',
    templateUrl: 'dialog-i-menu-role.html',
    providers: [IMenuRoleService],
})

export class DialogIMenuRoleComponent implements OnInit {

    roleDetail: RoleGroup;
    iMenuRoleList: IMenuRole[];
    allowedMenu: IMenuRole[] = [];
    treeMenu: MenuNode[] = [];

    /** Parameters of MatTreeFlatDataSource */
    treeControl: FlatTreeControl<MenuFlatNode>;
    treeFlattener: MatTreeFlattener<MenuNode, MenuFlatNode>;
    dataSource: MatTreeFlatDataSource<MenuNode, MenuFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<MenuFlatNode>(true /* multiple */);

    /** Parameters of MatTreeFlattener */
    private _getLevel = (node: MenuFlatNode) => node.level;
    private _isExpandable = (node: MenuFlatNode) => node.expandable;
    private _getChildren = (node: MenuNode): Observable<MenuNode[]> => observableOf(node.children);
    hasChild = (_: number, _nodeData: MenuFlatNode) => _nodeData.expandable;

    constructor(
        public dialogRef: MatDialogRef<DialogIMenuRoleComponent>,
        private iMenuRoleService: IMenuRoleService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.roleDetail = data[0];
        this.iMenuRoleList = data[1];
        this.treeMenu = data[2];

        this.treeFlattener = new MatTreeFlattener(
            this.transformer,
            this._getLevel,
            this._isExpandable,
            this._getChildren
        );
        this.treeControl = new FlatTreeControl<MenuFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSource.data = this.treeMenu;
    }

    ngOnInit() {
        /** 取出角色清單可用Memu清單 */
        // 先將database該角色資料show on the tree
        this.iMenuRoleList.filter(x => x.roleId === this.roleDetail.roleId).forEach(y => {
            this.allowedMenu.push(y);
            this.checklistSelection.select(
                this.treeControl.dataNodes.find(x => x.menuId === y.menuId)
            );
        });
    }

    transformer = (node: MenuNode, level: number) => {
        return new MenuFlatNode(node.menuText, node.menuId, level, !!node.children);
    }

    /** Whether all the descendants of the node are selected */
    descendantsAllSelected(node: MenuFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every(child => this.checklistSelection.isSelected(child));
    }

    /** 只要有任一child被選取則check=true*/
    descendantsPartiallySelected(node: MenuFlatNode): boolean {
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
    checkParentSelection(node: MenuFlatNode): void {
        // this.checklistSelection.toggle(node);
        // toggle在某些太難判斷情況，用select/deselect分開處理
        // 只要有選到child或本來就已selected，就自動select parent
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
    indeterminateSelected(node: MenuFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    onNoClick() {
        this.dialogRef.close(false);
    }

    onYesClick() {
        const originMenuIds: number[] = [];
        const newMenuIds: number[] = [];

        // 拉出來做一個只含menuId的array
        this.allowedMenu.forEach(menu => {
            originMenuIds.push(menu.menuId);
        });
        this.checklistSelection.selected.forEach(menu => {
            newMenuIds.push(menu.menuId);
        });

        /** 交集*/
        // let Intersection = OriginMenuIds.filter(v => NewMenuIds.includes(v));
        // subtracting
        const subtractingOfOrigin = originMenuIds.filter(v => !newMenuIds.includes(v));
        const subtractingOfNew = newMenuIds.filter(v => !originMenuIds.includes(v));

        /** do nothing at 交集 Intersection */
        // if( Intersection ){
        //     console.log(Intersection);
        // }

        /** delete at SubtractingOfOrigin */
        subtractingOfOrigin.forEach(menuId =>
            this.deleteImenuRole(this.roleDetail.roleId, menuId)
        );

        /** insert at SubtractingOfNew */
        subtractingOfNew.forEach(menuId =>
            this.postImenuRole(this.roleDetail.roleId, menuId)
        );

        this.dialogRef.close(true);
    }

    postImenuRole(roleId: number, menuId: number) {
        const data: IMenuRole = {
            roleId: roleId,
            menuId: menuId
        };
        this.iMenuRoleService.postIMenuRole(data).subscribe((result: any) => {
            // console.log(result);
        }, (error) => {
            console.log(error);
        });
    }

    deleteImenuRole(roleId: number, menuId: number) {
        this.iMenuRoleService.deleteIMenuRole(menuId, roleId).subscribe((result: any) => {
            // console.log(result);
        }, (error) => {
            console.log(error);
        });
    }

    compareObjects(o1: any, o2: any): boolean {
        // if (o1 == '') o1 = null;
        return o1 === o2;
    }
}
