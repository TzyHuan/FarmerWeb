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
  //public dataSource: MenuDataSource | null;
  public dataSource: MatTableDataSource<Menu> | null;
  public dataLength = 0;
  public displayedColumns: string[] = ['menuId', 'path', 'menuText', 'sortNo', 'component', 'rootMenuId', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild('filter') filter: ElementRef;

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

    //重新讀取Table資料
    //this.rebuildMenuList();

    //將新增form先加入一張填寫欄位
    this.addMenuForm = this._fb.group({
      containLists: this._fb.array([
        this.initaddMenuForm(),
      ])
    });

  }

  refresh() {
    this.loadData();
  }

  loadData() {

    //利用自訂class的方式實作Mat-Table的dataSource
    //this.dataSource = new MenuDataSource(this.MenuREST, this.paginator, this.sort);

    this.MenuREST.GetMenu().subscribe((data: Menu[]) => {
      this.MenuList = data;
      this.dataSource = new MatTableDataSource<Menu>(data);
      if (this.dataSource) {
        this.dataLength = data.length;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);

        //開始監聽來至各FormControl地filter有無輸入關鍵字
        //Listen menuIdFilter
        this.menuIdFilter.valueChanges.subscribe(value => {
          this.filterValues.menuId = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        //Listen pathFilter
        this.pathFilter.valueChanges.subscribe(value => {
          this.filterValues.path = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        //Listen menuTextFilter
        this.menuTextFilter.valueChanges.subscribe(value => {
          this.filterValues.menuText = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        //Listen sortNoFilter
        this.sortNoFilter.valueChanges.subscribe(value => {
          this.filterValues.sortNo = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        //Listen componentFilter
        this.componentFilter.valueChanges.subscribe(value => {
          this.filterValues.component = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        //Listen rootMenuIdFilter
        this.rootMenuIdFilter.valueChanges.subscribe(value => {
          this.filterValues.rootMenuId = value;
          this.dataSource.filter = JSON.stringify(this.filterValues);
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
    //console.log("addMenuList");
    const control = <FormArray>this.addMenuForm.controls['containLists'];
    control.push(this.initaddMenuForm());
  }

  removeMenuList(i: number) {
    // remove address from the list
    const control = <FormArray>this.addMenuForm.controls['containLists'];
    control.removeAt(i);
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
    this.ngOnInit();
  }

  addMenu() {
    this.MenuREST.PostMenu(this.FormMenu).subscribe(
      (result: any) => {
        //console.log(result);
        this.rebuildMenuList();
      },
      error => {
        console.log(error);
      }
    )
  }

  rebuildMenuList() {
    this.MenuREST.GetMenu().subscribe(
      (result: Menu[]) => {
        //console.log(result);
        this.MenuList = result;
      },
      error => {
        console.log(error);
      }
    )
  }
  //#endregion

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
}

//#region 自定義Mat-Table DataSource
export class MenuDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    console.log(filter);
    this._filterChange.next(filter);
  }

  filteredData: Menu[] = [];
  renderedData: Menu[] = [];
  returnConnected: Observable<Menu[]>;

  constructor(private MenuREST: MenuService, public _paginator: MatPaginator, public _sort: MatSort) {
    super();

    // Reset to the first page when the user changes the filter.
    console.log('constructor')
    this._filterChange.subscribe(() => {
      this._paginator.pageIndex = 0;
      console.log('Reset to the first page');
      this.connect().subscribe();
    });
  }
  connect(): Observable<Menu[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.MenuREST.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];
    console.log("Connect!!!")
    return merge(displayDataChanges).pipe(
      mergeMap(() => {
        //Call API to recieve data First!!!
        return this.MenuREST.GetMenu().pipe(
          map((data) => {
            this.MenuREST.dataChange.next(data);

            // Filter data
            this.filteredData = this.MenuREST.data.slice().filter((menu: Menu) => {
              const searchStr = (menu.menuId + menu.menuText + menu.path + menu.component + menu.sortNo + menu.rootMenuId).toLowerCase();
              return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });

            // Sort filtered data
            const sortedData = this.sortData(this.filteredData.slice());

            // Grab the page's slice of the filtered sorted data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
            return this.renderedData;
          })
        );
      })
    )
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  sortData(data: Menu[]): Menu[] {
    console.log('sortData')
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      //a:small, b:large
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'menuId': [propertyA, propertyB] = [a.menuId, b.menuId]; break;
        case 'menuText': [propertyA, propertyB] = [a.menuText, b.menuText]; break;
        case 'path': [propertyA, propertyB] = [a.path, b.path]; break;
        case 'sortNo': [propertyA, propertyB] = [a.sortNo, b.sortNo]; break;
        case 'component': [propertyA, propertyB] = [a.component, b.component]; break;
        case 'rootMenuId': [propertyA, propertyB] = [a.rootMenuId, b.rootMenuId]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      console.log(propertyA);
      console.log(+propertyA);

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
  //#endregion
}