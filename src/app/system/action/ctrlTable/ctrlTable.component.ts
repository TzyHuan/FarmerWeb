import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CtrlService } from '../action.service';
import { Ctrl } from '../action';

import { DialogCtrlDeleteComponent } from './dialog/dialog-ctrl-delete.component';
import { DialogCtrlUpdateComponent } from './dialog/dialog-ctrl-update.component';
import { DialogCtrlCreateComponent } from './dialog/dialog-ctrl-create.component';

import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

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
                //this.ActionDataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);
            }
        });
    }

    //#region Dialog patterns
    openDeleteDialog(CtrlDetial: Ctrl): void {
        const dialogRef = this.dialog.open(DialogCtrlDeleteComponent, {
          width: '250px',
          data: CtrlDetial
        });

        dialogRef.afterClosed().subscribe(result => {          
          this.loadData();
        });
    }

    openUpdateDialog(CtrlDetial: Ctrl): void {
        const dialogRef = this.dialog.open(DialogCtrlUpdateComponent, {
          width: '400px',
          data: CtrlDetial
        });

        dialogRef.afterClosed().subscribe(result => {         
          this.loadData();
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(DialogCtrlCreateComponent, {
          width: '80%'         
        });

        dialogRef.afterClosed().subscribe(result => {         
          this.loadData();
        });
    }
    //#endregion
}