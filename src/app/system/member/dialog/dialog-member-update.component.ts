import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Member } from '../member';
import { MemberService } from '../member.service';
import { NgForm, FormGroupDirective, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'dialog-member-update',
  templateUrl: 'dialog-member-update.html',
  providers: [ MemberService ]
})

export class DialogMemberUpdateComponent {
  public MemberDetail: Member;

  public matcher = new MyErrorStateMatcher();
 
  constructor(public dialogRef: MatDialogRef<DialogMemberUpdateComponent>,
    private MemberREST: MemberService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.MemberDetail = this.data;  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    //console.log(this.RoleDetail.roleId);
    this.putMenu(this.MemberDetail.account, this.MemberDetail);
    this.dialogRef.close();
  }

  putMenu(id: string, UpdatedMember: Member) {
    this.MemberREST.PutMember(id, UpdatedMember).subscribe(
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