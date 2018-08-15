import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { v34 } from '../../ApiKmv/v34';
import { V34Service } from '../../ApiKmv/v34.service';

import { DialogSupplyChainCreateComponent } from '../dialog/dialog-supplychain-create.component';
import { DialogSupplyChainDeleteComponent } from '../dialog/dialog-supplychain-delete.component';

@Component({
    selector: 'drawer-supplychain',
    templateUrl: './drawer-supplychain.component.html',
    styleUrls: ['./drawer-supplychain.component.css'],
    providers: [V34Service]
})

export class DrawerSupplyChainComponent implements OnInit{ 
    SideList: v34[] = [];


    constructor(private REST_v34: V34Service, public dialog: MatDialog) {      

    } 

    ngOnInit(){
        //抓側欄資料
        this.getContent();

    }

    getContent() {
        this.REST_v34.GetV34().subscribe((result: v34[]) => {
            this.SideList = result;
        });
    }

    //#region Dialogs    
    openDeleteDialog(item: v34): void {
        const dialogRef = this.dialog.open(DialogSupplyChainDeleteComponent, {
            width: '250px',
            data: item
        });

        dialogRef.afterClosed().subscribe(result => {
            //刷新側欄
            this.getContent();
        });
    }

    openUpdateDialog(item: v34): void {
        var isModified:boolean = true;
        const dialogRef = this.dialog.open(DialogSupplyChainCreateComponent, {
            width: '80%',
            data: [item, isModified]
        });

        dialogRef.afterClosed().subscribe(result => {
            //刷新側欄
            this.getContent();
        });       
    }
    //#endregion    
}