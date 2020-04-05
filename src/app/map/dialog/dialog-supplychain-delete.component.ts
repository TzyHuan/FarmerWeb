import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { v34 } from '../../../api/ApiKmv/v34';
import { V34Service } from '../../../api/ApiKmv/v34.service';


@Component({
    selector: 'dialog-supplychain-delete',
    templateUrl: 'dialog-supplychain-delete.component.html',
    providers: [V34Service]
  })
  export class DialogSupplyChainDeleteComponent {

    constructor(public dialogRef: MatDialogRef<DialogSupplyChainDeleteComponent>,
      private REST_v34: V34Service,
      @Inject(MAT_DIALOG_DATA) public data: v34) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

    onYesClick(): void {
      this.REST_v34.DeleteV34(this.data.v3401, this.data.v3404).subscribe(
        (result: any) => {
            // console.log(result);
          },
          error => {
            console.log(error);
          }
      );
      this.dialogRef.close();
    }

  }
