import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Ctrl } from '../../../../../interface/system_auth/ctrl';
import { CtrlService } from '../../../../../api/system_auth/ctrl.service';
import { environment } from '../../../../../environments/environment';

@Component({
    // moduleId: module.id,
    selector: 'dialog-ctrl-create',
    templateUrl: 'dialog-ctrl-create.html',
    styleUrls: ['../../action.component.css'],
    providers: [CtrlService],
})

export class DialogCtrlCreateComponent {

    ctrlForm: FormGroup = new FormGroup({
        id: new FormControl(),
        name: new FormControl(),
        description: new FormControl(),
        appId: new FormControl({ value: environment.appId }),
    });

    constructor(
        public dialogRef: MatDialogRef<DialogCtrlCreateComponent>,
        private ctrlService: CtrlService,
    ) {

    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(InsertData: Ctrl): void {
        // console.log(InsertData)
        this.createCtrl(InsertData);
        this.dialogRef.close(true);
    }

    createCtrl(data: Ctrl) {
        this.ctrlService.postCtrl(data).subscribe((result: any) => {
            // console.log(result);
        }, (error) => {
            console.log(error);
        });
    }
}
