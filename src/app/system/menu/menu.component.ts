import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MenuPositionX } from '@angular/material';
import { Menu } from './menu';
import { MenuService } from './menu.service'
import { error } from 'protractor';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MenuService]
})
export class MenuComponent implements OnInit {

  public MenuList: Menu[];
  public FormModel: Menu = new Menu();

  constructor(private MenuREST: MenuService, public dialog: MatDialog) {
    this.rebuildMenuList();
  }

  ngOnInit() {
  }

  addMenu() {
    this.MenuREST.PostMenu(this.FormModel).subscribe(
      (result: any) => {
        console.log(result);
        this.rebuildMenuList();
      },
      error => {
        console.log(error);
      }
    )
  }

  rebuildMenuList() {
    this.MenuREST.GetMenu().subscribe(
      (result: Menu[]) => {
        console.log(result);
        this.MenuList = result;
      },
      error => {
        console.log(error);
      }
    )
  }

  openDeleteDialog(MenuDetial: Menu): void {
    const dialogRef = this.dialog.open(DialogDeleteMenuComponent, {
      width: '250px',
      data: MenuDetial
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.rebuildMenuList();
    });
  }

  openUpdateDialog(MenuDetial: Menu): void {
    const dialogRef = this.dialog.open(DialogUpdateMenuComponent, {
      width: '400px',      
      data: [MenuDetial, this.MenuList]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.rebuildMenuList();
    });
  }
}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
  providers: [MenuService]
})
export class DialogDeleteMenuComponent {

  constructor(public dialogRef: MatDialogRef<DialogDeleteMenuComponent>,
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

@Component({
  selector: 'dialog-update',
  templateUrl: 'dialog-update.html',
  providers: [MenuService]
})
export class DialogUpdateMenuComponent {
  public MenuDetial: Menu;
  public MenuList: Menu[];
  constructor(public dialogRef: MatDialogRef<DialogUpdateMenuComponent>,
    private MenuREST: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.MenuDetial = this.data[0];
    this.MenuList = this.data[1];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    console.log(this.MenuDetial.menuId);
    this.putMenu(this.MenuDetial.menuId, this.MenuDetial);
    this.dialogRef.close();
  }

  putMenu(id: number, UpdatedMenu: Menu) {
    this.MenuREST.PutMenu(id, UpdatedMenu).subscribe(
      (result: any) => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    )
  }

  compareObjects(o1: any, o2: any): boolean {    
    return o1 == o2;
  }
}