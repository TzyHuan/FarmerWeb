import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Ctrl } from '../../../../../interface/system_auth/ctrl';
import { CtrlService } from '../../../../../api/system_auth/ctrl.service'

@Component({
  selector: 'dialog-ctrl-update',
  templateUrl: 'dialog-ctrl-update.html',
  providers: [CtrlService],
})
export class DialogCtrlUpdateComponent {
  
  ctrlDetail: Ctrl;

  constructor(
    public dialogRef: MatDialogRef<DialogCtrlUpdateComponent>,
    private ctrlService: CtrlService,
    @Inject(MAT_DIALOG_DATA) public data: Ctrl,
  ) {
    this.ctrlDetail = data;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onYesClick() {
    //console.log(this.CtrlDetial.CtrlId);
    this.putCtrl(this.ctrlDetail.ctrlId, this.ctrlDetail);
    this.dialogRef.close();
  }

  putCtrl(id: number, updatedCtrl: Ctrl) {
    this.ctrlService.putCtrl(id, updatedCtrl).subscribe((result: any) => {
      //console.log(result);
    }, (error) => {
      console.log(error);
    });
  }
}