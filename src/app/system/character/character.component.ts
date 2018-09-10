import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleGroup, ImenuRole, IactionRole, ActionNode } from './character';
import { Menu, MenuNode } from '../menu/menu';
import { Action } from '../action/action';

import { CharacterService, ImenuRolesService, IactionRolesService } from './character.service';
import { MenuService } from '../menu/menu.service';
import { ActionService } from '../action/action.service';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';

import { DialogCharacterCreateComponent } from './dialog/dialog-character-create.component';
import { DialogCharacterDeleteComponent } from './dialog/dialog-character-delete.component';
import { DialogCharacterUpdateComponent } from './dialog/dialog-character-update.component';
import { DialogImenuRoleComponent } from './dialog/dialog-ImenuRole.component';
import { DialogIactionRoleComponent } from './dialog/dialog-IactionRole.component';
import { zip } from 'rxjs/observable/zip';

@Component({
  selector: 'system-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
  providers: [CharacterService, ImenuRolesService, IactionRolesService, MenuService, ActionService]
})
export class CharacterComponent implements OnInit {

  /** 傳至Dialog */
  //列舉選項
  public RoleList: RoleGroup[];
  //ImenuRole
  public ImenuRoleList: ImenuRole[];
  public TreeMenu: MenuNode[];
  //IactionRole
  public IactionRoleList: IactionRole[];
  public TreeAction: ActionNode[];

  /** Parameters of Mat-Table */
  public dataSource: MatTableDataSource<RoleGroup> | null;
  public displayedColumns: string[] = [
    'roleId', 'roleName', 'sortNo', 'accessScope',
    'description', 'parentRoleId', 'rejectScope',
    'approveScope', 'submitScope', 'passScope', 'printScope', 'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private CharacterREST: CharacterService,
    private ImenuRoleREST: ImenuRolesService,
    private IactionRoleREST: IactionRolesService,
    private MenuREST: MenuService,
    private ActionREST: ActionService,
    public dialog: MatDialog) { }

  ngOnInit() {
    //讀取Mat-Table資料
    this.loadData();
  }


  loadData() {
    /** Call api reload data on table */
    this.CharacterREST.GetRoleGroup().subscribe((data: RoleGroup[]) => {

      this.dataSource = new MatTableDataSource<RoleGroup>(data);

      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        //this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);
      }

      /** 把選單資料代入Dialog選項 且 增加"無隸屬"的選項 */
      // 由於JavaScript shallow copy的緣故，unshift this.RoleList會連動改變data，因此放最後再unshift
      // StackOverFlow-6612385:
      // An array in JavaScript is also an object and variables only hold a reference to an object, 
      // not the object itself. Thus both variables have a reference to the same object.
      // Deep copy!不然MatTable也會多一個"無"的資料
      this.RoleList = JSON.parse(JSON.stringify(data));
      this.RoleList.unshift({
        roleId: null,
        roleName: '無'
      });
    });

    /** 由於 ImenuRoleDialog 需要同時需要ImenuRole、Menu的資料，先call再傳到children Component讓操作更流暢 */
    this.loadImenuRole();
    this.loadIactionRole();
  }

  //#region Dialog patterns
  openDeleteDialog(RoleDetial: RoleGroup): void {
    const dialogRef = this.dialog.open(DialogCharacterDeleteComponent, {
      width: '250px',
      data: RoleDetial
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.reloadData();
    });
  }

  openUpdateDialog(RoleDetial: RoleGroup): void {
    const dialogRef = this.dialog.open(DialogCharacterUpdateComponent, {
      width: '400px',
      data: [RoleDetial, this.RoleList]
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.reloadData();
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DialogCharacterCreateComponent, {
      width: '80%',
      data: this.RoleList
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.reloadData();
    });
  }

  openImenuRoleDialog(RoleDetial): void {
    const dialogRef = this.dialog.open(DialogImenuRoleComponent, {
      width: '300px',
      data: [RoleDetial, this.ImenuRoleList, this.TreeMenu]
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.loadImenuRole();
    });
  }

  openIactionRoleDialog(RoleDetial): void {
    const dialogRef = this.dialog.open(DialogIactionRoleComponent, {
      width: '350px',
      data: [RoleDetial, this.IactionRoleList, this.TreeAction]
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) this.loadIactionRole();
    });
  }  
  //#endregion

  reloadData() {
    this.CharacterREST.GetRoleGroup().subscribe((data: RoleGroup[]) => {
      this.dataSource.data = data;
    });
  }

  loadImenuRole() {
    zip(this.ImenuRoleREST.GetImenuRole(), this.MenuREST.GetMenuTree()).subscribe(value => {
      this.ImenuRoleList = value[0];
      this.TreeMenu = value[1];
    });
  }

  loadIactionRole() {
    zip(this.IactionRoleREST.GetIactionRole(), this.ActionREST.GetActionTree()).subscribe(value => {
      this.IactionRoleList = value[0];
      this.TreeAction = value[1];
    });
  }
}