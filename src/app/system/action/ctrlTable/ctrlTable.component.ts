import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CtrlService } from '../action.service';
import { Ctrl } from '../action';
import { FormControl } from '@angular/forms';
import { isNullOrUndefined } from 'util';

import { DialogCtrlDeleteComponent } from './dialog/dialog-ctrl-delete.component';
import { DialogCtrlUpdateComponent } from './dialog/dialog-ctrl-update.component';
import { DialogCtrlCreateComponent } from './dialog/dialog-ctrl-create.component';

import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { startWith, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'mat-table-ctrl',
    templateUrl: './ctrlTable.component.html',
    styleUrls: ['../action.component.css'],
    providers: [CtrlService]
})

export class CtrlTableComponent implements OnInit {

    //Parameters of Mat-Table    
    @Input('Paginator') public paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public CtrlDataSource: MatTableDataSource<Ctrl> | null;
    public CtrlDisplayedColumns: string[] = ['id', 'name', 'description', 'actions'];

    //Parameters of filters
    public idFilter = new FormControl();
    public nameFilter = new FormControl();
    public descriptionFilter = new FormControl();
    public filterValues = { ctrlId: '', name: '', description: '' };
    public idFilteredOptions: Observable<string[]>;
    public nameFilteredOptions: Observable<string[]>;
    public descriptionFilteredOptions: Observable<string[]>;

    constructor(private CtrlREST: CtrlService, public dialog: MatDialog) {

    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.CtrlREST.GetCtrls().subscribe((data: Ctrl[]) => {
            this.CtrlDataSource = new MatTableDataSource<Ctrl>(data);
            if (this.CtrlDataSource) {
                this.CtrlDataSource.sort = this.sort;
                this.CtrlDataSource.paginator = this.paginator;
                this.CtrlDataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);

                //#region 開始監聽來至各FormControl地filter有無輸入關鍵字
                //Listen idFilter
                this.idFilteredOptions = this.idFilter.valueChanges.pipe(
                    startWith(''),
                    tap(value => {
                        this.filterValues.ctrlId = value;
                        this.CtrlDataSource.filter = JSON.stringify(this.filterValues);
                        this.CtrlDataSource.paginator.firstPage();
                    }),
                    map(value => this._autoFilter(
                        data.map(v => v.ctrlId.toString()),
                        value
                    ))
                );

                //Listen nameFilter
                this.nameFilteredOptions = this.nameFilter.valueChanges.pipe(
                    startWith(''),
                    tap(value=>{
                        this.filterValues.name = value;
                        this.CtrlDataSource.filter = JSON.stringify(this.filterValues);
                        this.CtrlDataSource.paginator.firstPage();
                    }),
                    map(value=>this._autoFilter(
                        data.map(v => v.name),
                        value
                    ))
                );

                //Listen descriptionFilter
                this.descriptionFilteredOptions = this.descriptionFilter.valueChanges.pipe(
                    startWith(''),
                    tap(value=>{
                        this.filterValues.description = value;
                        this.CtrlDataSource.filter = JSON.stringify(this.filterValues);
                        this.CtrlDataSource.paginator.firstPage();
                    }),
                    map(value=>this._autoFilter(
                        data.filter(x => x.description != null && x.description.length > 0)
                            .map(v => v.description),
                        value
                    ))
                );                
             
                //#endregion
            }
        });
    }

    private _autoFilter(options: string[], value: string): string[] {
        const filterValue = value.toLowerCase();
        options = [...new Set(options)];//distinct the array  
        return options.filter(option => option.toLowerCase().includes(filterValue));
    }

    customFilter(Data: Ctrl, Filter: string): boolean {
        //取Filter條件
        let searchTerms: Ctrl = JSON.parse(Filter);

        //先預判是否有沒有值的欄位，無值不篩選進來
        let JudgedId: boolean = isNullOrUndefined(Data.ctrlId) ?
            true : Data.ctrlId.toString().indexOf(searchTerms.ctrlId.toString()) != -1

        let JudgedName: boolean = isNullOrUndefined(Data.name) ?
            true : Data.name.toString().toLowerCase().indexOf(searchTerms.name.toLowerCase()) != -1

        //Because of data.description may contain null, searchTerms without anything should not filter out this data
        let JudgedDescription: boolean = searchTerms.description == "" ?
            true : (isNullOrUndefined(Data.description) ?
                false : Data.description.toString().toLowerCase().indexOf(searchTerms.description.toLowerCase()) != -1);

        //交集為true者，才是要顯示的Dat
        return JudgedId && JudgedName && JudgedDescription
    }

    //#region Dialog patterns
    openDeleteDialog(CtrlDetial: Ctrl): void {
        const dialogRef = this.dialog.open(DialogCtrlDeleteComponent, {
            width: '250px',
            data: CtrlDetial
        });

        dialogRef.afterClosed().subscribe((saved:boolean) => {
            if(saved) this.reloadData();
        });
    }

    openUpdateDialog(CtrlDetial: Ctrl): void {
        const dialogRef = this.dialog.open(DialogCtrlUpdateComponent, {
            width: '400px',
            data: CtrlDetial
        });

        dialogRef.afterClosed().subscribe((saved:boolean) => {
            if(saved) this.reloadData();
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(DialogCtrlCreateComponent, {
            width: '80%'
        });

        dialogRef.afterClosed().subscribe((saved:boolean) => {
            if(saved) this.reloadData();
        });
    }

    reloadData(){
        this.CtrlREST.GetCtrls().subscribe((data: Ctrl[]) => {
            this.CtrlDataSource.data = data;
        });
    }
    //#endregion
}