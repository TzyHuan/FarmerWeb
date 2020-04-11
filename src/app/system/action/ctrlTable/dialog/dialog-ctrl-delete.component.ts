import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ctrl } from '../../../../../interface/system_auth/ctrl';
import { CtrlService } from '../../../../../api/system_auth/ctrl.service';


@Component({
  selector: 'dialog-ctrl-delete',
  templateUrl: 'dialog-ctrl-delete.html',
  providers: [CtrlService],
})
export class DialogCtrlDeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogCtrlDeleteComponent>,
    private ctrlService: CtrlService,
    @Inject(MAT_DIALOG_DATA) public data: Ctrl,
  ) {

  }

  onNoClick() {
    this.dialogRef.close();
  }

  onYesClick() {
    this.deleteMenu(this.data.ctrlId);
    this.dialogRef.close();
  }

  deleteMenu(id: number) {
    this.ctrlService.deleteCtrl(id).subscribe((result: any) => {
      // console.log(result);
    }, (error) => {
      console.log(error);
    });
  }
}
