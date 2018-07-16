import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActionService } from '../action.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Action } from '../action';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material';

import { DialogActionCreateComponent } from './dialog/dialog-action-create.component';
import { DialogActionDeleteComponent } from './dialog/dialog-action-delete.component';
import { DialogActionUpdateComponent } from './dialog/dialog-action-update.component';

@Component({
    selector: 'mat-table-action',
    templateUrl: './actionTable.component.html',
    styleUrls: ['../action.component.css'],
    providers: [ActionService]
})

export class ActionTableComponent implements OnInit {

    //Parameters of Mat-Table    
    @Input('Paginator') public paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public ActionDataSource: MatTableDataSource<Action> | null;
    public ActionDisplayedColumns: string[] = ['id', 'name', 'method', 'controllerId', 'description', 'actions'];

    //Parameters of filters
    public idFilter = new FormControl();
    public nameFilter = new FormControl();
    public methodFilter = new FormControl();
    public controllerIdFilter = new FormControl();
    public descriptionFilter = new FormControl();
    public filterValues = { id: '', name: '', method: '', controllerId: '', description: '' }

    constructor(private ActionREST: ActionService, public dialog:MatDialog) {

    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.ActionREST.GetActions().subscribe((data: Action[]) => {
            this.ActionDataSource = new MatTableDataSource<Action>(data);
            if (this.ActionDataSource) {
                this.ActionDataSource.sort = this.sort;
                this.ActionDataSource.paginator = this.paginator;
                this.ActionDataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);

                //#region 開始監聽來至各FormControl地filter有無輸入關鍵字
                //Listen idFilter
                this.idFilter.valueChanges.subscribe(value => {
                    this.filterValues.id = value;
                    this.ActionDataSource.filter = JSON.stringify(this.filterValues);
                    this.ActionDataSource.paginator.firstPage();
                });
                //Listen nameFilter
                this.nameFilter.valueChanges.subscribe(value => {
                    this.filterValues.name = value;
                    this.ActionDataSource.filter = JSON.stringify(this.filterValues);
                    this.ActionDataSource.paginator.firstPage();
                });
                //Listen methodFilter
                this.methodFilter.valueChanges.subscribe(value => {
                    this.filterValues.method = value;
                    this.ActionDataSource.filter = JSON.stringify(this.filterValues);
                    this.ActionDataSource.paginator.firstPage();
                });
                //Listen controllerIdFilter
                this.controllerIdFilter.valueChanges.subscribe(value => {                    
                    this.filterValues.controllerId = value;
                    this.ActionDataSource.filter = JSON.stringify(this.filterValues);
                    this.ActionDataSource.paginator.firstPage();
                });
                //Listen descriptionFilter
                this.descriptionFilter.valueChanges.subscribe(value => {
                    this.filterValues.description = value;
                    this.ActionDataSource.filter = JSON.stringify(this.filterValues);
                    this.ActionDataSource.paginator.firstPage();
                });                
                //#endregion
            }
        });
    }

    customFilter(Data: Action, Filter: string): boolean {
        //取Filter條件
        let searchTerms:Action = JSON.parse(Filter);

        //先預判是否有沒有值的欄位，無值不篩選進來
        let JudgedId: boolean = isNullOrUndefined(Data.id) ?
          true : Data.id.toString().indexOf(searchTerms.id.toString()) != -1
    
        let JudgedName: boolean = isNullOrUndefined(Data.name) ?
          true : Data.name.toString().toLowerCase().indexOf(searchTerms.name.toLowerCase()) != -1
    
        let JudgedMethod: boolean = isNullOrUndefined(Data.method) ?
          true : Data.method.toString().toLowerCase().indexOf(searchTerms.method.toLowerCase()) != -1
    
        let JudgedControllerId: boolean = isNullOrUndefined(Data.controllerId) ?
          true : Data.controllerId.toString().indexOf(searchTerms.controllerId.toString()) != -1
    
       
        //Because of data.description may contain null, searchTerms without anything should not filter out this data
        let JudgedDescription: boolean = searchTerms.description == "" ?
          true : (isNullOrUndefined(Data.description) ?
            false : Data.description.toString().toLowerCase().indexOf(searchTerms.description.toLowerCase()) != -1);
    
        //交集為true者，才是要顯示的Dat
        return JudgedId && JudgedName && JudgedMethod && JudgedControllerId && JudgedDescription
      }

    //#region Dialog patterns
    openDeleteDialog(ActionDetial: Action): void {
        const dialogRef = this.dialog.open(DialogActionDeleteComponent, {
          width: '250px',
          data: ActionDetial
        });

        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed');
          this.loadData();
        });
    }

    openUpdateDialog(ActionDetial: Action): void {
        const dialogRef = this.dialog.open(DialogActionUpdateComponent, {
          width: '400px',
          data: ActionDetial
        });

        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed');
          this.loadData();
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(DialogActionCreateComponent, {
          width: '80%',
          data: []
        });

        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed');
          this.loadData();
        });
    }
    //#endregion

}
