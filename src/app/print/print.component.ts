import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    //{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    //{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})

export class PrintComponent implements OnInit {


  public PrintForm: FormGroup = new FormGroup({
    beginDate: new FormControl(),
    endDate: new FormControl(),
    customer: new FormControl(),
    type: new FormControl(),
    variety: new FormControl(),
    brand: new FormControl(),
    printCategory: new FormControl(),
    printWord: new FormControl(),
    printExcel: new FormControl()
  });

  public Customer = new FormControl();

  constructor(private adapter: DateAdapter<any>) {
    this.adapter.setLocale('zh-TW'); 
  }

  ngOnInit() {    
  }

  Print(PrintInfo: any): void {
    console.log(PrintInfo)
  }

}
