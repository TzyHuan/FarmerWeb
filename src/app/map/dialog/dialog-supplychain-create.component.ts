import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { v34 } from '../../../api/ApiKmv/v34';
// import { Member } from '../member';
// import { MemberService } from '../member.service';

@Component({
    selector: 'dialog-supplychain-create',
    templateUrl: 'dialog-supplychain-create.component.html',
    //styleUrls: ['../member.component.css'],
    //providers: [MemberService]
})

export class DialogSupplyChainCreateComponent {

    public data: v34;
    public isModified: boolean;


    //SelectedCompanyType: number = 2; //預設初始值為'供應商'
    CompanyTypeList: CompanyType[] = [
        { typeName: '客戶', value: 1 },
        { typeName: '供應商', value: 2 }
    ];


    constructor(public dialogRef: MatDialogRef<DialogSupplyChainCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public recieve: v34) {

        this.data = recieve[0];
        this.isModified = recieve[1];
    }

    closeDialog(event:any) {
        console.log("saved: ",event);
        this.dialogRef.close();
    }

}

export class CompanyType {
    typeName: string;
    value: number;
}