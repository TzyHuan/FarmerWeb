import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Action } from '../../../../../interface/system_auth/action';
import { ActionService } from '../../../../../api/system_auth/action.service';

@Component({
  selector: 'dialog-action-update',
  templateUrl: 'dialog-action-update.html',
  providers: [ActionService],
})

export class DialogActionUpdateComponent {

  actionDetail: Action;
  methodList: string[] = ['GET', 'POST', 'PUT', 'DELETE'];

  constructor(
    public dialogRef: MatDialogRef<DialogActionUpdateComponent>,
    private actionService: ActionService,
    @Inject(MAT_DIALOG_DATA) public data: Action,
  ) {
    this.actionDetail = data;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    // console.log(this.ActionDetial.ActionId);
    this.putAction(this.actionDetail.actionId, this.actionDetail);
    this.dialogRef.close(true);
  }

  putAction(id: number, updatedAction: Action) {
    this.actionService.putAction(id, updatedAction).subscribe((result: any) => {
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
