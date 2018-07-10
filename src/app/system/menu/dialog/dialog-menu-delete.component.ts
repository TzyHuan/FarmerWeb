import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Menu } from '../menu';
import { MenuService } from '../menu.service'


@Component({
    selector: 'dialog-menu-delete',
    templateUrl: 'dialog-menu-delete.html',
    providers: [MenuService]
  })
  export class DialogMenuDeleteComponent {
  
    constructor(public dialogRef: MatDialogRef<DialogMenuDeleteComponent>,
      private MenuREST: MenuService,
      @Inject(MAT_DIALOG_DATA) public data: Menu) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onYesClick(): void {
      this.deleteMenu(this.data.menuId);
      this.dialogRef.close();
    }
  
    deleteMenu(id: number) {
      this.MenuREST.DeleteMenu(id).subscribe(
        (result: any) => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      )
    }
  }