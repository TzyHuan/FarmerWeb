import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';

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

export class DrawerSupplyChainComponent implements OnInit {
    sideCompanyList: v34[] = [];
    CompanyFilter = new FormControl();
    filteredCompany: v34[];

    constructor(private REST_v34: V34Service, public dialog: MatDialog) {

    }

    ngOnInit() {
        //抓側欄資料
        this.getContent();

        //Listen CompanyFilter
        this.CompanyFilter.valueChanges.pipe(startWith('')).subscribe(value => {
            this.filteredCompany = this.sideCompanyList.filter((v, i, a) => {
                return this.companyFilter(v,value)
            });
        });
    }

    getContent() {
        this.REST_v34.GetV34().subscribe((result: v34[]) => {
            this.filteredCompany = this.sideCompanyList = result;
        });
    }

    companyFilter(Data: v34, searchTerms: string): boolean {
        //Filter obj
        let FilterItem = JSON.stringify(Data).replace(/"|{|}|:| |,|-/g, '');        

        Object.getOwnPropertyNames(Data).forEach((v)=>{
            FilterItem = FilterItem.replace(v,'');
        })
       
        let Judged: boolean = FilterItem.toLowerCase().indexOf(searchTerms.toLowerCase()) != -1;

        //為true者，才是要顯示的Data
        return Judged       
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
        var isModified: boolean = true;
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