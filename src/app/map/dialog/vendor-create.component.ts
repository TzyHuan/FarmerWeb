import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { v34 } from '../../ApiKmv/v34';
import { V34Service } from '../../ApiKmv/v34.service'

@Component({
    selector: 'vendor-create',
    templateUrl: 'vendor-create.component.html',
    //styleUrls: ['../member.component.css'],
    providers: [V34Service]
})

export class VendorCreateComponent implements OnInit {
    
    @Input() data: v34;
    @Input() isModified: boolean = false;
    @Output() saved: EventEmitter<boolean> = new EventEmitter();
    ReadOnly:boolean;

    constructor(private REST_v34: V34Service) {
        //input參數在此尚未得到
    }

    ngOnInit() {
        if(this.isModified){
            //操作狀態是要修改的           
            this.ReadOnly = true;
        }
        else{
           //操作狀態是要新增的
            this.ReadOnly = false;
        }        
    }

    onNoClick(): void {
        this.saved.next(false);
    }

    onYesClick(InsertData: v34): void {
        this.REST_v34.PostV34(InsertData).subscribe(
            (result: any) => {
                //console.log(result);
                this.saved.next(true);
            },
            error => {
                console.log(error);
            }
        );        
    }

    onPutClick(InsertData: v34){        
        this.REST_v34.PutV34(InsertData).subscribe(
            (result: any) => {
                //console.log(result);
                this.ReadOnly=!this.ReadOnly;
                this.saved.next(true);
            },
            error => {
                console.log(error);
            }
        );
    }
}