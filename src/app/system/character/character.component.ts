import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleGroup } from '../../../interface/system_auth/role_group';
import { IMenuRole } from '../../../interface/system_auth/i_menu_role';
import { ActionNode } from '../../../interface/system_auth/vm_i_role';
import { IActionRole } from '../../../interface/system_auth/i_action_role';
import { Menu, MenuNode } from '../../../interface/system_auth/menu';

import { MenuService } from '../../../api/system_auth/menu.service';
import { ActionService } from '../../../api/system_auth/action.service';
import { RoleGroupService } from '../../../api/system_auth/role_group.service';
import { IMenuRoleService } from '../../../api/system_auth/i_menu_role.service';
import { IActionRoleService } from '../../../api/system_auth/i_action_role.service';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';

import { DialogCharacterCreateComponent } from './dialog/dialog-character-create.component';
import { DialogCharacterDeleteComponent } from './dialog/dialog-character-delete.component';
import { DialogCharacterUpdateComponent } from './dialog/dialog-character-update.component';
import { DialogIMenuRoleComponent } from './dialog/dialog-i-menu-role.component';
import { DialogIActionRoleComponent } from './dialog/dialog-i-action-role.component';
import { zip } from 'rxjs/observable/zip';

@Component({
  selector: 'system-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
  providers: [RoleGroupService, IMenuRoleService, IActionRoleService, MenuService, ActionService],
})
export class CharacterComponent implements OnInit {

  /** 傳至Dialog */
  // 列舉選項
  roleList: RoleGroup[];
  // IMenuRole
  iMenuRoleList: IMenuRole[];
  treeMenu: MenuNode[];
  // IActionRole
  iActionRoleList: IActionRole[];
  treeAction: ActionNode[];

  /** Parameters of Mat-Table */
  dataSource: MatTableDataSource<RoleGroup> | null;
  displayedColumns: string[] = [
    'roleId', 'roleName', 'sortNo', 'accessScope',
    'description', 'parentRoleId', 'rejectScope',
    'approveScope', 'submitScope', 'passScope', 'printScope', 'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private menuService: MenuService,
    private actionService: ActionService,
    private roleGroupService: RoleGroupService,
    private iMenuRoleService: IMenuRoleService,
    private iActionRoleService: IActionRoleService,
  ) { }

  ngOnInit() {
    // 讀取Mat-Table資料
    this.loadData();
  }

  loadData() {
    /** Call api reload data on table */
    this.roleGroupService.getRoleGroup().subscribe((data: RoleGroup[]) => {

      this.dataSource = new MatTableDataSource<RoleGroup>(data);

      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);
      }

      /** 把選單資料代入Dialog選項 且 增加"無隸屬"的選項 */
      //  由於JavaScript shallow copy的緣故，unshift this.RoleList會連動改變data，因此放最後再unshift
      //  StackOverFlow-6612385:
      //  An array in JavaScript is also an object and variables only hold a reference to an object,
      //  not the object itself. Thus both variables have a reference to the same object.
      //  Deep copy!不然MatTable也會多一個"無"的資料
      this.roleList = JSON.parse(JSON.stringify(data));
      this.roleList.unshift({
        roleId: null,
        roleName: '無'
      });
    });

    /** 由於 IMenuRoleDialog 需要同時需要IMenuRole、Menu的資料，先call再傳到children Component讓操作更流暢 */
    this.loadIMenuRole();
    this.loadIActionRole();
  }

  openDeleteDialog(RoleDetial: RoleGroup) {
    const dialogRef = this.dialog.open(DialogCharacterDeleteComponent, {
      width: '250px',
      data: RoleDetial,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) { this.reloadData(); }
    });
  }

  openUpdateDialog(roleDetial: RoleGroup) {
    const dialogRef = this.dialog.open(DialogCharacterUpdateComponent, {
      width: '400px',
      data: [roleDetial, this.roleList],
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) { this.reloadData(); }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(DialogCharacterCreateComponent, {
      width: '80%',
      data: this.roleList,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) { this.reloadData(); }
    });
  }

  openIMenuRoleDialog(RoleDetial) {
    const dialogRef = this.dialog.open(DialogIMenuRoleComponent, {
      width: '300px',
      data: [RoleDetial, this.iMenuRoleList, this.treeMenu],
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) { this.loadIMenuRole(); }
    });
  }

  openIActionRoleDialog(RoleDetial): void {
    const dialogRef = this.dialog.open(DialogIActionRoleComponent, {
      width: '350px',
      data: [RoleDetial, this.iActionRoleList, this.treeAction],
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) { this.loadIActionRole(); }
    });
  }

  reloadData() {
    this.roleGroupService.getRoleGroup().subscribe((data: RoleGroup[]) => {
      this.dataSource.data = data;
    });
  }

  loadIMenuRole() {
    zip(this.iMenuRoleService.getIMenuRole(), this.menuService.getMenuTree()).subscribe(value => {
      this.iMenuRoleList = value[0];
      this.treeMenu = value[1];
    });
  }

  loadIActionRole() {
    zip(this.iActionRoleService.getIActionRole(), this.actionService.getActionTree()).subscribe(value => {
      this.iActionRoleList = value[0];
      this.treeAction = value[1];
    });
  }
}
