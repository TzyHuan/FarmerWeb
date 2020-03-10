import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Menu } from '../../../../interface/system_auth/menu';
import { MenuService } from '../../../../api/system_auth/menu.service'


@Component({
  selector: 'dialog-menu-delete',
  templateUrl: 'dialog-menu-delete.html',
  providers: [MenuService],
})

export class DialogMenuDeleteComponent {

  constructor(
    private menuService: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: Menu,
    public dialogRef: MatDialogRef<DialogMenuDeleteComponent>,
  ) {

  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick() {
    this.deleteMenu(this.data.menuId);
    this.dialogRef.close(true);
  }

  deleteMenu(id: number) {
    this.menuService.deleteMenu(id).subscribe((result: any) => {
      //console.log(result);
    }, (error) => {
      console.log(error);
    });
  }
}