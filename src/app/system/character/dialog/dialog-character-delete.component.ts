import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RoleGroup } from '../character';
import { CharacterService } from '../character.service'


@Component({
    selector: 'dialog-character-delete',
    templateUrl: 'dialog-character-delete.html',
    providers: [ CharacterService ]
  })
  export class DialogCharacterDeleteComponent {
  
    constructor(public dialogRef: MatDialogRef<DialogCharacterDeleteComponent>,
      private CharacterREST: CharacterService,
      @Inject(MAT_DIALOG_DATA) public data: RoleGroup) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onYesClick(): void {
      this.deleteMenu(this.data.roleId);
      this.dialogRef.close();
    }
  
    deleteMenu(id: number) {
      this.CharacterREST.DeleteRoleGroup(id).subscribe(
        (result: any) => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      )
    }
  }