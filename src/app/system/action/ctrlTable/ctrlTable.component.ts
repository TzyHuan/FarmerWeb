import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActionService } from '../action.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Ctrl } from '../action';

@Component({
    selector: 'mat-table-ctrl',
    templateUrl: './ctrlTable.component.html',
    styleUrls: ['../action.component.css'],
    providers: [ActionService]
})

export class CtrlTableComponent implements OnInit {

    //Parameters of Mat-Table    
    @Input('Paginator') public paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public CtrlDataSource: MatTableDataSource<Ctrl> | null;
    public CtrlDisplayedColumns: string[] = ['id', 'name', 'description', 'actions'];

    constructor(private CtrlREST: ActionService) {

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
        // const dialogRef = this.dialog.open(DialogMenuDeleteComponent, {
        //   width: '250px',
        //   data: MenuDetial
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //   //console.log('The dialog was closed');
        //   this.loadData();
        // });
    }

    openUpdateDialog(CtrlDetial: Ctrl): void {
        // const dialogRef = this.dialog.open(DialogMenuUpdateComponent, {
        //   width: '400px',
        //   data: [MenuDetial, this.MenuList]
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //   //console.log('The dialog was closed');
        //   this.loadData();
        // });
    }

    openCreateDialog(): void {
        // const dialogRef = this.dialog.open(DialogMenuCreateComponent, {
        //   width: '80%',
        //   data: this.MenuList
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //   //console.log('The dialog was closed');
        //   this.loadData();
        // });
    }
    //#endregion
}