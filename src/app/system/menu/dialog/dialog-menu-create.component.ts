import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Menu } from '../menu';
import { MenuService } from '../menu.service'
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'dialog-menu-create',
    templateUrl: 'dialog-menu-create.html',
    providers: [MenuService]
})
export class DialogMenuCreateComponent {

    public addMenuForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<DialogMenuCreateComponent>,
        private MenuREST: MenuService, public _fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public MenuList: Menu[]) {
        this.addMenuForm = this._fb.group({
            containLists: this._fb.array([
                this.initaddMenuForm(),
            ])
        });      
    }

    initaddMenuForm() {
        //若此地不加require，而在子component加入，則會發生前後不一致的警告！
        let DefaultRow = {
            menuId: ['', Validators.required],
            path: ['', Validators.required],
            menuText: ['', Validators.required],
            sortNo: ['', Validators.required],
            selector:[''],
            component: ['', Validators.required],
            rootMenuId: null
        }
        return this._fb.group(DefaultRow);
    }

    addMenuList() {
        // add address to the list   
        const control = <FormArray>this.addMenuForm.controls['containLists'];
        control.push(this.initaddMenuForm());       
    }

    removeMenuList(i: number) {
        // remove address from the list
        const control = <FormArray>this.addMenuForm.controls['containLists'];
        control.removeAt(i);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(InsertData:Menu[]): void {
        this.createMenu(InsertData);
        this.dialogRef.close();
    }

    createMenu(dataList: Menu[]) {
        dataList.forEach(data => {
            this.MenuREST.PostMenu(data).subscribe(
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