import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Member } from '../../../../interface/system_auth/member';
import { MemberService } from '../../../../api/system_auth/member.service';

@Component({
    //moduleId: module.id,
    selector: 'dialog-member-create',
    templateUrl: 'dialog-member-create.html',
    styleUrls: ['../member.component.css'],
    providers: [MemberService],
})

export class DialogMemberCreateComponent {

    memberForm: FormGroup = new FormGroup({
        domain: new FormControl(),
        firstName: new FormControl(),
        lastName: new FormControl(),
        deptId: new FormControl(),
        account: new FormControl(),
        password: new FormControl(),
        email: new FormControl('', [Validators.email]),
        isActive: new FormControl(true)
    });

    matcher = new MyErrorStateMatcher();

    constructor(
        public dialogRef: MatDialogRef<DialogMemberCreateComponent>,
        private memberService: MemberService,
    ) {

    }

    onNoClick() {
        this.dialogRef.close(false);
    }

    onYesClick(insertData: Member) {
        this.createMember(insertData);
        this.dialogRef.close(true);
    }

    createMember(data: Member) {
        this.memberService.postMember(data).subscribe((result: any) => {
            //console.log(result);
        }, (error) => {
            console.log(error);
        });
    }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}