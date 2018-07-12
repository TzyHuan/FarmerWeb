import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleGroup, ImenuRole } from './character';
import { Menu, MenuNode } from '../menu/menu';
import { CharacterService } from './character.service';
import { MenuService } from '../menu/menu.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';

import { DialogCharacterCreateComponent } from './dialog/dialog-character-create.component';
import { DialogCharacterDeleteComponent } from './dialog/dialog-character-delete.component';
import { DialogCharacterUpdateComponent } from './dialog/dialog-character-update.component';
import { DialogImenuRoleComponent } from './dialog/dialog-ImenuRole.component';
import { zip } from 'rxjs/observable/zip';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
  providers: [ CharacterService, MenuService ]
})
export class CharacterComponent implements OnInit {

  /** 傳至Dialog */
  //列舉選項
  public RoleList: RoleGroup[];
  //ImenuRol
  public MenuList: Menu[];
  public ImenuRoleList: ImenuRole[];
  public TreeMenu: MenuNode[];

  /** Parameters of Mat-Table */
  public dataSource: MatTableDataSource<RoleGroup> | null;
  public displayedColumns: string[] = [
    'roleId', 'roleName', 'sortNo', 'accessScope',
    'description', 'parentRoleId', 'rejectScope',
    'approveScope', 'submitScope', 'passScope', 'printScope', 'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private CharacterREST: CharacterService, private MenuREST: MenuService, public dialog: MatDialog) { }

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
      this.RoleList = data;
      this.RoleList.unshift({
        roleId: null,
        roleName: '無'
      });

    });

    /** 由於 ImenuRoleDialog 需要同時需要ImenuRole、Menu的資料，先call再傳到children Components節省流量 */
    zip(this.CharacterREST.GetImenuRole(), this.MenuREST.GetMenu(), this.MenuREST.GetTreeMenu()).subscribe(value => {
      this.MenuList = value[1];
      this.ImenuRoleList = value[0];
      this.TreeMenu = value[2];
    });
  }

  //#region Dialog patterns
  openDeleteDialog(RoleDetial: RoleGroup): void {
    const dialogRef = this.dialog.open(DialogCharacterDeleteComponent, {
      width: '250px',
      data: RoleDetial
    });

    dialogRef.afterClosed().subscribe(result => {     
      this.loadData();
    });
  }

  openUpdateDialog(RoleDetial: RoleGroup): void {
    const dialogRef = this.dialog.open(DialogCharacterUpdateComponent, {
      width: '400px',
      data: [RoleDetial, this.RoleList]
    });

    dialogRef.afterClosed().subscribe(result => {      
      this.loadData();
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DialogCharacterCreateComponent, {
      width: '80%',
      data: this.RoleList
    });

    dialogRef.afterClosed().subscribe(result => {      
      this.loadData();
    });
  }

  openImenuRoleDialog(RoleDetial): void {
    const dialogRef = this.dialog.open(DialogImenuRoleComponent, {
      width: '300px',
      data: [RoleDetial, this.ImenuRoleList, this.MenuList, this.TreeMenu]
    });

    dialogRef.afterClosed().subscribe(result => {      
      this.loadData();
    });
  }
  //#endregion
}