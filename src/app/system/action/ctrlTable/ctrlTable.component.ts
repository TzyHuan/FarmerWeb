import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, tap, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

import { Ctrl } from '../../../../interface/system_auth/ctrl';
import { CtrlService } from '../../../../api/system_auth/ctrl.service';
import { DialogCtrlDeleteComponent } from './dialog/dialog-ctrl-delete.component';
import { DialogCtrlUpdateComponent } from './dialog/dialog-ctrl-update.component';
import { DialogCtrlCreateComponent } from './dialog/dialog-ctrl-create.component';


@Component({
    selector: 'mat-table-ctrl',
    templateUrl: './ctrlTable.component.html',
    styleUrls: ['../action.component.css'],
    providers: [CtrlService],
})

export class CtrlTableComponent implements OnInit {

    //Parameters of Mat-Table    
    @Input('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ctrlDataSource: MatTableDataSource<Ctrl> | null;
    ctrlDisplayedColumns: string[] = ['id', 'name', 'description', 'actions'];

    //Parameters of filters
    idFilter = new FormControl();
    nameFilter = new FormControl();
    descriptionFilter = new FormControl();
    filterValues = { ctrlId: '', name: '', description: '' };
    idFilteredOptions: Observable<string[]>;
    nameFilteredOptions: Observable<string[]>;
    descriptionFilteredOptions: Observable<string[]>;

    constructor(
        public dialog: MatDialog,
        private ctrlService: CtrlService,
    ) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.ctrlService.getCtrls().subscribe((data: Ctrl[]) => {
            this.ctrlDataSource = new MatTableDataSource<Ctrl>(data);
            if (this.ctrlDataSource) {
                this.ctrlDataSource.sort = this.sort;
                this.ctrlDataSource.paginator = this.paginator;
                this.ctrlDataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);

                //Listen idFilter
                this.idFilteredOptions = this.idFilter.valueChanges.pipe(
                    startWith(''),
                    tap(value => {
                        this.filterValues.ctrlId = value;
                        this.ctrlDataSource.filter = JSON.stringify(this.filterValues);
                        this.ctrlDataSource.paginator.firstPage();
                    }),
                    map(value => this._autoFilter(
                        data.map(v => v.ctrlId.toString()),
                        value,
                    ))
                );

                //Listen nameFilter
                this.nameFilteredOptions = this.nameFilter.valueChanges.pipe(
                    startWith(''),
                    tap(value => {
                        this.filterValues.name = value;
                        this.ctrlDataSource.filter = JSON.stringify(this.filterValues);
                        this.ctrlDataSource.paginator.firstPage();
                    }),
                    map(value => this._autoFilter(
                        data.map(v => v.name),
                        value,
                    ))
                );

                //Listen descriptionFilter
                this.descriptionFilteredOptions = this.descriptionFilter.valueChanges.pipe(
                    startWith(''),
                    tap(value => {
                        this.filterValues.description = value;
                        this.ctrlDataSource.filter = JSON.stringify(this.filterValues);
                        this.ctrlDataSource.paginator.firstPage();
                    }),
                    map(value => this._autoFilter(
                        data.filter(x => x.description != null && x.description.length > 0)
                            .map(v => v.description),
                        value,
                    ))
                );
            }
        });
    }

    private _autoFilter(options: string[], value: string): string[] {
        const filterValue = value.toLowerCase();
        options = [...new Set(options)];//distinct the array  
        return options.filter(option => option.toLowerCase().includes(filterValue));
    }

    customFilter(data: Ctrl, filter: string): boolean {
        //取Filter條件
        let searchTerms: Ctrl = JSON.parse(filter);

        //先預判是否有沒有值的欄位，無值不篩選進來
        let judgedId: boolean = isNullOrUndefined(data.ctrlId) ?
            true : data.ctrlId.toString().indexOf(searchTerms.ctrlId.toString()) != -1;

        let judgedName: boolean = isNullOrUndefined(data.name) ?
            true : data.name.toString().toLowerCase().indexOf(searchTerms.name.toLowerCase()) != -1;

        //Because of data.description may contain null, searchTerms without anything should not filter out this data
        let judgedDescription: boolean = searchTerms.description == "" ?
            true : (isNullOrUndefined(data.description) ?
                false : data.description.toString().toLowerCase().indexOf(searchTerms.description.toLowerCase()) != -1);

        //交集為true者，才是要顯示的Dat
        return judgedId && judgedName && judgedDescription;
    }

    openDeleteDialog(ctrlDetial: Ctrl): void {
        const dialogRef = this.dialog.open(DialogCtrlDeleteComponent, {
            width: '250px',
            data: ctrlDetial,
        });

        dialogRef.afterClosed().subscribe((saved: boolean) => {
            if (saved) this.reloadData();
        });
    }

    openUpdateDialog(ctrlDetial: Ctrl): void {
        const dialogRef = this.dialog.open(DialogCtrlUpdateComponent, {
            width: '400px',
            data: ctrlDetial,
        });

        dialogRef.afterClosed().subscribe((saved: boolean) => {
            if (saved) this.reloadData();
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(DialogCtrlCreateComponent, {
            width: '80%'
        });

        dialogRef.afterClosed().subscribe((saved: boolean) => {
            if (saved) this.reloadData();
        });
    }

    reloadData() {
        this.ctrlService.getCtrls().subscribe((data: Ctrl[]) => {
            this.ctrlDataSource.data = data;
        });
    }
}