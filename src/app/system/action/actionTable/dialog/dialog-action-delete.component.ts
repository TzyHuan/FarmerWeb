import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Action } from '../../../../../interface/system_auth/action';
import { ActionService } from '../../../../../api/system_auth/action.service';

@Component({
  selector: 'dialog-action-delete',
  templateUrl: 'dialog-action-delete.html',
  providers: [ActionService],
})

export class DialogActionDeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogActionDeleteComponent>,
    private actionService: ActionService,
    @Inject(MAT_DIALOG_DATA) public data: Action,
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.deleteMenu(this.data.actionId);
    this.dialogRef.close(true);
  }

  deleteMenu(id: number) {
    this.actionService.deleteAction(id).subscribe((result: any) => {
      // console.log(result);
    }, (error) => {
      console.log(error);
    });
  }
}
