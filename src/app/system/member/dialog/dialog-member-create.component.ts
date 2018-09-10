import { Component, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Member } from '../member';
import { MemberService } from '../member.service';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
    //moduleId: module.id,
    selector: 'dialog-member-create',
    templateUrl: 'dialog-member-create.html',
    styleUrls: ['../member.component.css'],
    providers: [MemberService]
})

export class DialogMemberCreateComponent {

    public MemberForm: FormGroup = new FormGroup({
        domain: new FormControl(),
        firstName: new FormControl(),
        lastName: new FormControl(),
        deptId: new FormControl(),
        account: new FormControl(),
        password: new FormControl(),
        email: new FormControl('', [Validators.email]),
        isActive: new FormControl(true)
    });

    public matcher = new MyErrorStateMatcher();

    constructor(public dialogRef: MatDialogRef<DialogMemberCreateComponent>, private MemberREST: MemberService) {

    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(InsertData: Member): void {
        //console.log(InsertData)
        this.createMember(InsertData);
        this.dialogRef.close(true);
    }

    createMember(data: Member) {
        this.MemberREST.PostMember(data).subscribe(
            (result: any) => {
                //console.log(result);
            },
            error => {
                console.log(error);
            }
        )
    }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}