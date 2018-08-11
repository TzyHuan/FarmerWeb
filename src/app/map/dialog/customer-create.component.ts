import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { v34 } from '../../ApiKmv/v34';
import { V34Service } from '../../ApiKmv/v34.service';

@Component({
    selector: 'customer-create',
    templateUrl: 'customer-create.component.html',
    //styleUrls: ['../member.component.css'],
    providers: [V34Service]
})

export class CustomerCreateComponent implements OnInit {
    @Input() data: v34;
    @Output() saved: EventEmitter<boolean> = new EventEmitter();

    public CustomerForm: FormGroup = new FormGroup({
        v3401: new FormControl(),		/*客戶/供應商代號*/
        v3402: new FormControl(),		/*客戶/供應商名稱*/
        v3403: new FormControl(),		/*客戶/供應商簡稱*/
        v3404: new FormControl(),	    /*1.客戶2.供應商*/
        v3405: new FormControl(),	    /*客戶(供應商)區分		1.客戶(供應商)2.其他*/
        v3406: new FormControl(),		/*負責人*/
        v3407: new FormControl(),		/*連絡人*/
        v3408: new FormControl(),		/*統一編號*/
        v3409: new FormControl(),		/*地區別代號*/
        v3410: new FormControl(),		/*信用額度*/
        v3411: new FormControl(),		/*業務員*/
        v3412: new FormControl(),		/*電話*/
        v3413: new FormControl(),		/*傳真*/
        v3414: new FormControl(),		/*Email*/
        v3415: new FormControl(),		/*大哥大*/
        v3416: new FormControl(),		/*國別代號*/
        v3417: new FormControl(),		/*幣別代號*/
        v3418: new FormControl(),	    /*發票否(0.否1.是)*/
        v3419: new FormControl(),		/*客戶/供應商等級*/
        v3420: new FormControl(),		/*公司地址/英文地址1*/
        v3421: new FormControl(),		/*發票地址/英文地址2*/
        v3422: new FormControl(),		/*工廠地址/送貨地址*/
        v3423: new FormControl(),		/*備註*/
        v3424: new FormControl(),		/*客戶/供應商類別*/
        v3425: new FormControl(),		/*電話(1)*/
        v3426: new FormControl(),		/*電話(2)*/
        v3427: new FormControl(),       /*付款方式	1.月結2.貨到*/
        v3428: new FormControl(),	    /*帳款天數/票據到期*/
        v3429: new FormControl(),	    /*通路*/
        v3430: new FormControl(),		/*課稅別1.應稅2.零稅3.免稅*/
        v3431: new FormControl(),		/*發票種類1.三聯電子2.三聯收銀機3.2聯4.免開發票*/
        v3432: new FormControl(),		/*結帳日*/
        v3433: new FormControl(),       /*匯款銀行*/
        v3434: new FormControl(),       /*匯款帳號*/
        v3435: new FormControl(),       /*Lat*/
        v3436: new FormControl(),       /*Lng*/
        v3496: new FormControl(),		/*建立者*/
        v3497: new FormControl(),		/*建立日期*/
        v3498: new FormControl(),		/*異動者*/
        v3499: new FormControl()		/*異動日期*/
    });    

    constructor(private REST_v34: V34Service) {
        //input參數在此尚未得到
    }

    ngOnInit() {        
        //插入初始資料
        this.CustomerForm.controls['v3435'].setValue(this.data.v3435);
        this.CustomerForm.controls['v3436'].setValue(this.data.v3436);
        this.CustomerForm.controls['v3404'].setValue(this.data.v3404);        
    }

    onNoClick(): void {
        this.saved.next(false);
    }

    onYesClick(InsertData: v34): void {
        console.log(InsertData)
        this.REST_v34.PostV34(InsertData).subscribe(
            (result: any) => {
                //console.log(result);
            },
            error => {
                console.log(error);
            }
        );
        this.saved.next(true);
    }
}