import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RoleGroup } from '../../../../interface/system_auth/role_group';
import { RoleGroupService } from '../../../../api/system_auth/role_group.service';

@Component({
  selector: 'dialog-character-update',
  templateUrl: 'dialog-character-update.html',
  providers: [RoleGroupService],
})
export class DialogCharacterUpdateComponent {
  public roleDetail: RoleGroup;
  public roleList: RoleGroup[];
  constructor(
    public dialogRef: MatDialogRef<DialogCharacterUpdateComponent>,
    private roleGroupService: RoleGroupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.roleDetail = this.data[0];
    this.roleList = this.data[1];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.putMenu(this.roleDetail.roleId, this.roleDetail);
    this.dialogRef.close(true);
  }

  putMenu(id: number, UpdatedRole: RoleGroup) {
    this.roleGroupService.putRoleGroup(id, UpdatedRole).subscribe((result: any) => {
      // console.log(result);
    }, (error) => {
      console.log(error);
    });
  }

  compareObjects(o1: any, o2: any): boolean {
    if (o1 === '') { o1 = null; }
    return o1 === o2;
  }
}
