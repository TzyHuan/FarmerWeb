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
import { DataSource } from '@angular/cdk/table';

import { DialogMenuDeleteComponent } from '../../dialog/dialog-menu-delete.component';
import { DialogMenuUpdateComponent } from '../../dialog/dialog-menu-update.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MenuService]
})
export class MenuComponent implements OnInit {

  public MenuList: Menu[];
  public FormMenu: Menu = new Menu();
  public addMenuForm: FormGroup;  
  public dataSource: MatTableDataSource<Menu> | null;
  public displayedColumns: string[] = ['menuId', 'path', 'menuText', 'sortNo', 'component', 'rootMenuId', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;  

  //Parameters of filters
  private menuIdFilter = new FormControl();
  private pathFilter = new FormControl();
  private menuTextFilter = new FormControl();
  private sortNoFilter = new FormControl();
  private componentFilter = new FormControl();
  private rootMenuIdFilter = new FormControl();
  private filterValues = { menuId: '', path: '', menuText: '', sortNo: '', component: '', rootMenuId: '' }

  constructor(private MenuREST: MenuService, public httpClient: HttpClient, public dialog: MatDialog, public _fb: FormBuilder) {

  }

  ngOnInit() {
    //重新讀取Mat-Table資料
    this.loadData();
    
    //將新增form先加入一張填寫欄位
    this.addMenuForm = this._fb.group({
      containLists: this._fb.array([
        this.initaddMenuForm(),
      ])
    });
  }

  loadData() {
    //Call api reload data
    this.MenuREST.GetMenu().subscribe((data: Menu[]) => {
      this.MenuList = data;
      this.dataSource = new MatTableDataSource<Menu>(data);
      
      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);

        //開始監聽來至各FormControl地filter有無輸入關鍵字
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
      }
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
    this.addMenuForm.reset();
    this.loadData();
    this.ngOnInit();
  }

  //#region 新增Form相關項目
  initaddMenuForm() {
    //若此地不加require，而在子component加入，則會發生前後不一致的警告！
    let DefaultRow = {
      menuId: ['', Validators.required],
      path: ['', Validators.required],
      menuText: ['', Validators.required],
      sortNo: ['', Validators.required],
      component: ['', Validators.required],
      rootMenuId: null
    }
    return this._fb.group(DefaultRow);
  }

  addMenuList() {
    // add address to the list   
    const control = <FormArray>this.addMenuForm.controls['containLists'];
    control.push(this.initaddMenuForm());
  }

  removeMenuList(i: number) {
    // remove address from the list
    const control = <FormArray>this.addMenuForm.controls['containLists'];
    control.removeAt(i);
  }
  //#endregion

  //#region dialog patterns
  openDeleteDialog(MenuDetial: Menu): void {
    const dialogRef = this.dialog.open(DialogMenuDeleteComponent, {
      width: '250px',
      data: MenuDetial
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //this.rebuildMenuList();
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
      //this.rebuildMenuList();
      this.loadData();
    });
  }
  //#endregion
}