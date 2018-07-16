import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Ctrl } from '../../action';
import { CtrlService } from '../../action.service'


@Component({
    selector: 'dialog-ctrl-delete',
    templateUrl: 'dialog-ctrl-delete.html',
    providers: [ CtrlService ]
  })
  export class DialogCtrlDeleteComponent {
  
    constructor(public dialogRef: MatDialogRef<DialogCtrlDeleteComponent>,
      private CtrlREST: CtrlService,
      @Inject(MAT_DIALOG_DATA) public data: Ctrl) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onYesClick(): void {
      this.deleteMenu(this.data.id);
      this.dialogRef.close();
    }
  
    deleteMenu(id: number) {
      this.CtrlREST.DeleteCtrl(id).subscribe(
        (result: any) => {
          //console.log(result);
        },
        error => {
          console.log(error);
        }
      )
    }
  }