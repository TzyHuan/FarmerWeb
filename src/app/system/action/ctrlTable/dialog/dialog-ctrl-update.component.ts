import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Ctrl } from '../../action';
import { CtrlService } from '../../action.service'

@Component({
  selector: 'dialog-ctrl-update',
  templateUrl: 'dialog-ctrl-update.html',
  providers: [CtrlService]
})
export class DialogCtrlUpdateComponent {
  public CtrlDetail: Ctrl;
  constructor(public dialogRef: MatDialogRef<DialogCtrlUpdateComponent>,
    private CtrlREST: CtrlService,
    @Inject(MAT_DIALOG_DATA) public data: Ctrl) {
    this.CtrlDetail = data;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    //console.log(this.CtrlDetial.CtrlId);
    this.putCtrl(this.CtrlDetail.ctrlId, this.CtrlDetail);
    this.dialogRef.close();
  }

  putCtrl(id: number, UpdatedCtrl: Ctrl) {
    this.CtrlREST.PutCtrl(id, UpdatedCtrl).subscribe(
      (result: any) => {
        //console.log(result);
      },
      error => {
        console.log(error);
      }
    )
  }
}