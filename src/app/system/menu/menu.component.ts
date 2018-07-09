import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MenuPositionX } from '@angular/material';
import { Menu } from './menu';
import { MenuService } from './menu.service'
import { error } from 'protractor';
import { Observable, observable, merge, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, mergeMap, switchMap, tap } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { DialogMenuDeleteComponent } from '../../dialog/dialog-menu-delete.component';
import { DialogMenuUpdateComponent } from '../../dialog/dialog-menu-update.component';
import { DialogMenuCreateComponent } from '../../dialog/dialog-menu-create.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MenuService]
})
export class MenuComponent implements OnInit {

  //列舉選項傳至Dialog
  public MenuList: Menu[];

  //Parameters of Mat-Table
  public dataSource: MatTableDataSource<Menu> | null;
  public displayedColumns: string[] = ['menuId', 'path', 'menuText', 'sortNo', 'component', 'rootMenuId', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Parameters of filters
  public menuIdFilter = new FormControl();
  public pathFilter = new FormControl();
  public menuTextFilter = new FormControl();
  public sortNoFilter = new FormControl();
  public componentFilter = new FormControl();
  public rootMenuIdFilter = new FormControl();
  public filterValues = { menuId: '', path: '', menuText: '', sortNo: '', component: '', rootMenuId: '' }

  constructor(private MenuREST: MenuService, public httpClient: HttpClient, public dialog: MatDialog, public _fb: FormBuilder) {

  }

  ngOnInit() {
    //重新讀取Mat-Table資料
    this.loadData();

  }

  loadData() {
    //Call api reload data
    this.MenuREST.GetMenu().subscribe((data: Menu[]) => {

      this.dataSource = new MatTableDataSource<Menu>(data);

      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);

        //#region 開始監聽來至各FormControl地filter有無輸入關鍵字
        //Listen menuIdFilter
        this.menuIdFilter.valueChanges.subscribe(value => {
          this.filterValues.menuId = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          this.dataSource.paginator.firstPage();
        });
        //Listen pathFilter
        this.pathFilter.valueChanges.subscribe(value => {
          this.filterValues.path = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          this.dataSource.paginator.firstPage();
        });
        //Listen menuTextFilter
        this.menuTextFilter.valueChanges.subscribe(value => {
          this.filterValues.menuText = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          this.dataSource.paginator.firstPage();
        });
        //Listen sortNoFilter
        this.sortNoFilter.valueChanges.subscribe(value => {
          this.filterValues.sortNo = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          this.dataSource.paginator.firstPage();
        });
        //Listen componentFilter
        this.componentFilter.valueChanges.subscribe(value => {
          this.filterValues.component = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          this.dataSource.paginator.firstPage();
        });
        //Listen rootMenuIdFilter
        this.rootMenuIdFilter.valueChanges.subscribe(value => {
          this.filterValues.rootMenuId = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          this.dataSource.paginator.firstPage();
        });
        //#endregion
      }

      //把選單資料代入Dialog選項 且 增加"無隸屬"的選項
      this.MenuList = data;
      this.MenuList.unshift({ menuId: null, path: null, menuText: '無', sortNo: null, component: null, rootMenuId: null });

    });
  }

  customFilter(Data: Menu, Filter: string): boolean {
    //取Filter條件
    let searchTerms = JSON.parse(Filter);

    //先預判是否有沒有值的欄位，無值不篩選進來
    let JudgedMenuId: boolean = isNullOrUndefined(Data.menuId) ?
      true : Data.menuId.toString().toLowerCase().indexOf(searchTerms.menuId.toLowerCase()) != -1

    let JudgedPath: boolean = isNullOrUndefined(Data.path) ?
      true : Data.path.toString().toLowerCase().indexOf(searchTerms.path.toLowerCase()) != -1

    let JudgedMenuText: boolean = isNullOrUndefined(Data.menuText) ?
      true : Data.menuText.toString().toLowerCase().indexOf(searchTerms.menuText.toLowerCase()) != -1

    let JudgedSortNo: boolean = isNullOrUndefined(Data.sortNo) ?
      true : Data.sortNo.toString().toLowerCase().indexOf(searchTerms.sortNo.toLowerCase()) != -1

    let JudgedComponent: boolean = isNullOrUndefined(Data.component) ?
      true : Data.component.toString().toLowerCase().indexOf(searchTerms.component.toLowerCase()) != -1
    //Because of data.rootMenuId may contain null, searchTerms without anything should not filter out this data
    let JudgedRootMenuId: boolean = searchTerms.rootMenuId == "" ?
      true : (isNullOrUndefined(Data.rootMenuId) ?
        false : Data.rootMenuId.toString().toLowerCase().indexOf(searchTerms.rootMenuId.toLowerCase()) != -1);

    //交集為true者，才是要顯示的Dat
    return JudgedMenuId && JudgedPath && JudgedMenuText && JudgedSortNo && JudgedComponent && JudgedRootMenuId
  }

  save(model: Menu[]) {
    // call API to save
    model.forEach(menu => {
      this.MenuREST.PostMenu(menu).subscribe(
        (result: any) => {
          console.log('Menu: ' + menu.menuText + ' ok!');
        },
        error => {
          console.log(error);
        }
      )
    });

    //重置畫面    
    this.loadData();
    this.ngOnInit();
  }

  //#region Dialog patterns
  openDeleteDialog(MenuDetial: Menu): void {
    const dialogRef = this.dialog.open(DialogMenuDeleteComponent, {
      width: '250px',
      data: MenuDetial
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.loadData();
    });
  }

  openUpdateDialog(MenuDetial: Menu): void {
    const dialogRef = this.dialog.open(DialogMenuUpdateComponent, {
      width: '400px',
      data: [MenuDetial, this.MenuList]
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.loadData();
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DialogMenuCreateComponent, {
      width: '80%',
      data: this.MenuList
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.loadData();
    });
  }
  //#endregion
}