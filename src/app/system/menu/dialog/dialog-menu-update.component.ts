import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Menu } from '../../../../interface/system_auth/menu';
import { MenuService } from '../../../../api/system_auth/menu.service';

@Component({
  selector: 'dialog-menu-update',
  templateUrl: 'dialog-menu-update.html',
  providers: [MenuService],
})
export class DialogMenuUpdateComponent {

  menuDetial: Menu;
  menuList: Menu[];

  constructor(
    private menuService: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: [Menu, Menu[]],
    public dialogRef: MatDialogRef<DialogMenuUpdateComponent>,
  ) {
    this.menuDetial = this.data[0];
    this.menuList = this.data[1];
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick() {
    this.putMenu(this.menuDetial.menuId, this.menuDetial);
    this.dialogRef.close(true);
  }

  putMenu(id: number, menu: Menu) {
    this.menuService.putMenu(id, menu).subscribe((result: any) => {
      // console.log(result);
    }, (error) => {
      console.log(error);
    });
  }

  compareObjects(o1: any, o2: any): boolean {
    if (o1 === '') {
      o1 = null;
    }
    return o1 === o2;
  }
}
