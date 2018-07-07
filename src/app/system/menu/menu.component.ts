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
      this.dataSource = new MatTableDataSource<Menu>(data);
      if (this.dataSource) {
        this.dataLength = data.length;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }

    })

    //監聽filter有無輸入關鍵字
    // fromEvent(this.filter.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(1000),
    //     distinctUntilChanged()
    //   ).subscribe(() => {
    //     if (!this.dataSource) {
    //       return;
    //     }
    //     console.log('here')
    //     //this.dataSource.filter = this.filter.nativeElement.value;
    //     let filters = this.filter.nativeElement.value
    //     this.dataSource.filterPredicate = (data:Menu, filters:string) => {
    //       const matchFilter = [];
    //       console.log(filters);
    //       const filterArray = filters.split(',');
    //       console.log(this.displayedColumns.pop())
    //       const columns = this.displayedColumns.pop();
    //       return true
    //     }
    //   });
    this.menuIdFilter.valueChanges.subscribe(value => {
      if (!this.dataSource) {
        return;
      }
      console.log(value)
      this.filterValues.menuId = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);
      this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);
    });

  }

  customFilter(Data: Menu, Filter: string): boolean {
    let searchTerms = JSON.parse(Filter);
    console.log(Filter)
    return Data.menuId.toString().indexOf(searchTerms.menuId) != -1
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