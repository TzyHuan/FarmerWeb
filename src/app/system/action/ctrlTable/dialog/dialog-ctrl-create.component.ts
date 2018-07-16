import { Component, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Ctrl } from '../../action';
import { CtrlService } from '../../action.service';
import { formControlBinding } from '@angular/forms/src/directives/reactive_directives/form_control_directive';
@Component({
    //moduleId: module.id,
    selector: 'dialog-ctrl-create',
    templateUrl: 'dialog-ctrl-create.html',
    styleUrls: ['../../action.component.css'],
    providers: [CtrlService]
})

export class DialogCtrlCreateComponent {
    
    public CtrlForm: FormGroup= new FormGroup({
        id: new FormControl(),
        name: new FormControl(),
        description: new FormControl()
     });

    constructor(public dialogRef: MatDialogRef<DialogCtrlCreateComponent>, private CtrlREST: CtrlService ) {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(InsertData: Ctrl): void {
        //console.log(InsertData)
        this.createCtrl(InsertData);
        this.dialogRef.close();
    }

    createCtrl(data: Ctrl) {
        this.CtrlREST.PostCtrl(data).subscribe(
            (result: any) => {
                //console.log(result);
            },
            error => {
                console.log(error);
            }
        )
    }
}