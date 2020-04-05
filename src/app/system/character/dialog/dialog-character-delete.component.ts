import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RoleGroup } from '../../../../interface/system_auth/role_group';
import { RoleGroupService } from '../../../../api/system_auth/role_group.service';

@Component({
  selector: 'dialog-character-delete',
  templateUrl: 'dialog-character-delete.html',
  providers: [RoleGroupService],
})

export class DialogCharacterDeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogCharacterDeleteComponent>,
    private roleGroupService: RoleGroupService,
    @Inject(MAT_DIALOG_DATA) public data: RoleGroup,
  ) { }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick() {
    this.deleteMenu(this.data.roleId);
    this.dialogRef.close(true);
  }

  deleteMenu(id: number) {
    this.roleGroupService.deleteRoleGroup(id).subscribe((result: any) => {
      // console.log(result);
    }, (error) => {
      console.log(error);
    });
  }
}
