import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RoleGroup } from '../system/character/character';
import { CharacterService } from '../system/character/character.service'
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'dialog-character-create',
    templateUrl: 'dialog-character-create.html',
    providers: [CharacterService]
})
export class DialogCharacterCreateComponent {

    public addRoleForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<DialogCharacterCreateComponent>,
        private CharacterREST: CharacterService, public _fb:FormBuilder,
        @Inject(MAT_DIALOG_DATA) public RoleList: RoleGroup[]) {

        this.addRoleForm = this._fb.group({
            containLists: this._fb.array([
                this.initaddRoleForm(),
            ])
        });
    }
   
    initaddRoleForm() {
        //若此地不加require，而在子component加入，則會發生前後不一致的警告！
        let DefaultRow = {
            roleId: ['', Validators.required],
            roleName: ['', Validators.required],
            sortNo: ['', Validators.required],
            accessScope: [''],
            description: [''],
            parentRoleId: [null],
            rejectScope: [false],
            approveScope: [false],
            submitScope: [false],
            passScope: [false],
            printScope: [false]            
        }
        return this._fb.group(DefaultRow);
    }

    addRoleList() {
        // add address to the list   
        const control = <FormArray>this.addRoleForm.controls['containLists'];
        control.push(this.initaddRoleForm());
    }

    removeRoleList(i: number) {
        // remove address from the list
        const control = <FormArray>this.addRoleForm.controls['containLists'];
        control.removeAt(i);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(InsertData: RoleGroup[]): void {
        console.log(InsertData)
        this.createRole(InsertData);
        this.dialogRef.close();
    }

    createRole(dataList: RoleGroup[]) {
        dataList.forEach(data => {
            this.CharacterREST.PostRoleGroup(data).subscribe(
                (result: any) => {
                    console.log(result);
                },
                error => {
                    console.log(error);
                }
            )
        });
    }
}