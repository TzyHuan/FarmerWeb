import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { v34 } from '../../ApiKmv/v34';
// import { Member } from '../member';
// import { MemberService } from '../member.service';

@Component({
    selector: 'dialog-supplychain-create',
    templateUrl: 'dialog-supplychain-create.component.html',
    //styleUrls: ['../member.component.css'],
    //providers: [MemberService]
})

export class DialogSupplyChainCreateComponent {

    //SelectedCompanyType: number = 2; //預設初始值為'供應商'
    CompanyTypeList: CompanyType[] = [
        {typeName:'客戶', value:1},
        {typeName:'供應商', value:2}
    ];


    constructor(public dialogRef: MatDialogRef<DialogSupplyChainCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: v34) {

        //todo enum
        if (data.v3404 === 1) {
            //this.SelectedCompanyType = "客戶";
        }
        else if (data.v3404 === 2) {
            //this.SelectedCompanyType = "供應商";
        }
        else
        {
            //假設沒有值，預設初始值為'供應商'
            //data.v3404 =2;
        }

    }

    closeDialog() {
        this.dialogRef.close();
    }

}

export class CompanyType{
    typeName:string;
    value:number;
}