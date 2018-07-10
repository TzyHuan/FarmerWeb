import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RoleGroup } from '../character';
import { CharacterService } from '../character.service'

@Component({
    selector: 'dialog-character-update',
    templateUrl: 'dialog-character-update.html',
    providers: [ CharacterService ]
  })
  export class DialogCharacterUpdateComponent {
    public RoleDetail: RoleGroup;
    public RoleList: RoleGroup[];
    constructor(public dialogRef: MatDialogRef<DialogCharacterUpdateComponent>,
      private CharacterREST: CharacterService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.RoleDetail = this.data[0];
      this.RoleList = this.data[1];
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onYesClick(): void {
      console.log(this.RoleDetail.roleId);
      this.putMenu(this.RoleDetail.roleId, this.RoleDetail);
      this.dialogRef.close();
    }
  
    putMenu(id: number, UpdatedRole: RoleGroup) {
      this.CharacterREST.PutRoleGroup(id, UpdatedRole).subscribe(
        (result: any) => {
          //console.log(result);
        },
        error => {
          console.log(error);
        }
      )
    }
  
    compareObjects(o1: any, o2: any): boolean {      
      if(o1=='')o1=null;
      return o1 == o2;
    }
  }