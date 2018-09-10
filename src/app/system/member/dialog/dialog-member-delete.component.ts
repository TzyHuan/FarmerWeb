import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Member } from '../member';
import { MemberService } from '../member.service'


@Component({
    selector: 'dialog-member-delete',
    templateUrl: 'dialog-member-delete.html',
    providers: [ MemberService ]
  })
  export class DialogMemberDeleteComponent {
  
    constructor(public dialogRef: MatDialogRef<DialogMemberDeleteComponent>,
      private MemberREST: MemberService,
      @Inject(MAT_DIALOG_DATA) public data: Member) { }
  
    onNoClick(): void {
      this.dialogRef.close(false);
    }
  
    onYesClick(): void {
      this.deleteMenu(this.data.account);
      this.dialogRef.close(true);
    }
  
    deleteMenu(id: string) {
      this.MemberREST.DeleteMember(id).subscribe(
        (result: any) => {
          //console.log(result);
        },
        error => {
          console.log(error);
        }
      )
    }
  }