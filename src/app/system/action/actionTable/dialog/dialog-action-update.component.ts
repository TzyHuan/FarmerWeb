import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Action } from '../../action';
import { ActionService } from '../../action.service'

@Component({
  selector: 'dialog-action-update',
  templateUrl: 'dialog-action-update.html',
  providers: [ActionService]
})
export class DialogActionUpdateComponent {
  public ActionDetail: Action;
  public MethodList: string[] = ['GET', 'POST', 'PUT', 'DELETE'];


  constructor(public dialogRef: MatDialogRef<DialogActionUpdateComponent>,
    private ActionREST: ActionService,
    @Inject(MAT_DIALOG_DATA) public data: Action) {
      //console.log(data)
    this.ActionDetail = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    //console.log(this.ActionDetial.ActionId);
    this.putAction(this.ActionDetail.id, this.ActionDetail);
    this.dialogRef.close();
  }

  putAction(id: number, UpdatedAction: Action) {
    this.ActionREST.PutAction(id, UpdatedAction).subscribe(
      (result: any) => {
        //console.log(result);
      },
      error => {
        console.log(error);
      }
    )
  }

  compareObjects(o1: any, o2: any): boolean {
    if (o1 == '') o1 = null;
    return o1 == o2;
  }
}