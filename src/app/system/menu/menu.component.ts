import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MenuPositionX } from '@angular/material';
import { Menu } from './menu';
import { MenuService } from './menu.service'
import { error } from 'protractor';
import { Observable, observable, merge, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, mergeMap, switchMap, tap } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';

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
  public dataSource:MatTableDataSource<Menu> | null;
  public dataLength = 0;
  public displayedColumns: string[] = ['menuId', 'path', 'menuText', 'sortNo', 'component', 'rootMenuId', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private MenuREST: MenuService, public httpClient: HttpClient, public dialog: MatDialog, public _fb: FormBuilder) {
  
  }

  ngOnInit() {

    this.loadData();

    this.rebuildMenuList();
    this.addMenuForm = this._fb.group({
      containLists: this._fb.array([
        this.initaddMenuForm(),
      ])
    });
    //console.log(this.MenuList);
    //this.dataSource = new MatTableDataSource(this.MenuList);
    //console.log(this.dataSource);
  }

  refresh() {
    this.loadData();
  }

  loadData() {
    this.MenuREST = new MenuService(this.httpClient);
    //this.dataSource = new MenuDataSource(this.MenuREST, this.paginator, this.sort);
    this.MenuREST.GetMenu().subscribe((data:Menu[])=>{
      this.dataSource = new MatTableDataSource<Menu>(data);      
      this.dataLength = data.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })


    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

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

  openDeleteDialog(MenuDetial: Menu): void {
    const dialogRef = this.dialog.open(DialogDeleteMenuComponent, {
      width: '250px',
      data: MenuDetial
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.rebuildMenuList();
    });
  }

  openUpdateDialog(MenuDetial: Menu): void {
    const dialogRef = this.dialog.open(DialogUpdateMenuComponent, {
      width: '400px',
      data: [MenuDetial, this.MenuList]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.rebuildMenuList();
    });
  }
}

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
}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
  providers: [MenuService]
})
export class DialogDeleteMenuComponent {

  constructor(public dialogRef: MatDialogRef<DialogDeleteMenuComponent>,
    private MenuREST: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: Menu) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.deleteMenu(this.data.menuId);
    this.dialogRef.close();
  }

  deleteMenu(id: number) {
    this.MenuREST.DeleteMenu(id).subscribe(
      (result: any) => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    )
  }
}

@Component({
  selector: 'dialog-update',
  templateUrl: 'dialog-update.html',
  providers: [MenuService]
})
export class DialogUpdateMenuComponent {
  public MenuDetial: Menu;
  public MenuList: Menu[];
  constructor(public dialogRef: MatDialogRef<DialogUpdateMenuComponent>,
    private MenuREST: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.MenuDetial = this.data[0];
    this.MenuList = this.data[1];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    console.log(this.MenuDetial.menuId);
    this.putMenu(this.MenuDetial.menuId, this.MenuDetial);
    this.dialogRef.close();
  }

  putMenu(id: number, UpdatedMenu: Menu) {
    this.MenuREST.PutMenu(id, UpdatedMenu).subscribe(
      (result: any) => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    )
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 == o2;
  }
}