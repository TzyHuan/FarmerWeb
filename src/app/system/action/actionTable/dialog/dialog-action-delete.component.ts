import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Action } from '../../action';
import { ActionService } from '../../action.service'


@Component({
    selector: 'dialog-action-delete',
    templateUrl: 'dialog-action-delete.html',
    providers: [ ActionService ]
  })
  export class DialogActionDeleteComponent {
  
    constructor(public dialogRef: MatDialogRef<DialogActionDeleteComponent>,
      private ActionREST: ActionService,
      @Inject(MAT_DIALOG_DATA) public data: Action) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onYesClick(): void {
      this.deleteMenu(this.data.id);
      this.dialogRef.close();
    }
  
    deleteMenu(id: number) {
      this.ActionREST.DeleteAction(id).subscribe(
        (result: any) => {
          //console.log(result);
        },
        error => {
          console.log(error);
        }
      )
    }
  }