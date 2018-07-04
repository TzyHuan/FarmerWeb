import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MenuPositionX } from '@angular/material';
import { Menu } from './menu';
import { MenuService } from './menu.service'
import { error } from 'protractor';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [ MenuService ]
})
export class MenuComponent implements OnInit {

  public MenuList: Menu[];
  public FormMenu: Menu = new Menu();
  public addMenuForm: FormGroup;

  constructor(private MenuREST: MenuService, public dialog: MatDialog, public _fb: FormBuilder) {
  }

  ngOnInit() {
    this.rebuildMenuList();
    this.addMenuForm = this._fb.group({
      containLists: this._fb.array([
        this.initaddMenuForm(),
      ])
    });
  }

  initaddMenuForm() {
    //若此地不加require，而在子component加入，則會發生前後不一致的警告！
    let DefaultRow = {
      menuId: ['', Validators.required],
      path: ['', Validators.required],
      menuText: ['', Validators.required],
      sortNo: ['', Validators.required],
      component: ['', Validators.required],
      rootMenuId: null
    }
    return this._fb.group(DefaultRow);
  }

  addMenuList() {
    // add address to the list
    //console.log("addMenuList");
    const control = <FormArray>this.addMenuForm.controls['containLists'];
    control.push(this.initaddMenuForm());
  }

  removeMenuList(i: number) {
    // remove address from the list
    const control = <FormArray>this.addMenuForm.controls['containLists'];
    control.removeAt(i);
  }

  save(model: Menu[]) {
    // call API to save
    model.forEach(menu => {
      this.MenuREST.PostMenu(menu).subscribe(
        (result: any) => {
          console.log('Menu: ' + menu.menuText + ' ok!');          
        },
        error => {
          console.log(error);
        }
      )
    });

    //重置畫面
    this.addMenuForm.reset();
    this.ngOnInit();
  }

  addMenu() {
    this.MenuREST.PostMenu(this.FormMenu).subscribe(
      (result: any) => {
        //console.log(result);
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
        //console.log(result);
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