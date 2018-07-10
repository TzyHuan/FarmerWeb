import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleGroup } from './character';
import { CharacterService } from './character.service'
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';

import { DialogCharacterCreateComponent } from './dialog/dialog-character-create.component';
import { DialogCharacterDeleteComponent } from './dialog/dialog-character-delete.component';
import { DialogCharacterUpdateComponent } from './dialog/dialog-character-update.component';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
  providers: [CharacterService]
})
export class CharacterComponent implements OnInit {

  //列舉選項傳至Dialog
  public RoleList: RoleGroup[];

  //Parameters of Mat-Table
  public dataSource: MatTableDataSource<RoleGroup> | null;
  public displayedColumns: string[] = [
    'roleId', 'roleName', 'sortNo', 'accessScope',
    'description', 'parentRoleId', 'rejectScope',
    'approveScope', 'submitScope', 'passScope', 'printScope','actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private CharacterREST: CharacterService, public dialog: MatDialog) { }

  ngOnInit() {
    //重新讀取Mat-Table資料
    this.loadData();
  }


  loadData() {
    //Call api reload data
    this.CharacterREST.GetRoleGroup().subscribe((data: RoleGroup[]) => {
      
      this.dataSource = new MatTableDataSource<RoleGroup>(data);

      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        //this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);

      }

      //把選單資料代入Dialog選項 且 增加"無隸屬"的選項
      //由於JavaScript shallow copy的緣故，unshift this.RoleList會連動改變data，因此放最後再unshift
      //StackOverFlow-6612385:
      //An array in JavaScript is also an object and variables only hold a reference to an object, 
      //not the object itself. Thus both variables have a reference to the same object.
      this.RoleList = data;
      this.RoleList.unshift({     
        roleId:null,   
        roleName: '無'        
      });

    });
  }

  //#region Dialog patterns
  openDeleteDialog(RoleDetial: RoleGroup): void {
    const dialogRef = this.dialog.open(DialogCharacterDeleteComponent, {
      width: '250px',
      data: RoleDetial
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.loadData();
    });
  }

  openUpdateDialog(RoleDetial: RoleGroup): void {
    const dialogRef = this.dialog.open(DialogCharacterUpdateComponent, {
      width: '400px',
      data: [RoleDetial, this.RoleList]
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.loadData();
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DialogCharacterCreateComponent, {
      width: '80%',
      data: this.RoleList
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.loadData();
    });
  }
  //#endregion
}