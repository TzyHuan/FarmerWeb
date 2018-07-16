import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Action } from '../../action';
import { ActionService } from '../../action.service'
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'dialog-action-create',
    templateUrl: 'dialog-action-create.html',
    providers: [ActionService]
})
export class DialogActionCreateComponent {

    public addActionForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<DialogActionCreateComponent>,
        private ActionREST: ActionService, public _fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public ActionList: Action[]) {
        this.addActionForm = this._fb.group({
            containLists: this._fb.array([
                this.initaddActionForm(),
            ])
        });
    }

    initaddActionForm() {
        //若此地不加require，而在子component加入，則會發生前後不一致的警告！
        let DefaultRow = {
            id: ['', Validators.required],
            name: ['', Validators.required],
            method: ['', Validators.required],
            controllerId: ['', Validators.required],
            description: ['']           
        }
        return this._fb.group(DefaultRow);
    }

    addActionList() {
        // add address to the list   
        const control = <FormArray>this.addActionForm.controls['containLists'];
        control.push(this.initaddActionForm());
    }

    removeActionList(i: number) {
        // remove address from the list
        const control = <FormArray>this.addActionForm.controls['containLists'];
        control.removeAt(i);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(InsertData:Action[]): void {        
        this.createAction(InsertData);
        this.dialogRef.close();
    }

    createAction(dataList: Action[]) {
        dataList.forEach(data => {
            this.ActionREST.PostAction(data).subscribe(
                (result: any) => {
                    //console.log(result);
                },
                error => {
                    console.log(error);
                }
            )
        });
    }
}