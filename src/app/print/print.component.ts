import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Print } from './print';
import { PrintService } from './print.service';

import { v34 } from '../ApiKmv/v34';
import { V34Service } from '../ApiKmv/v34.service';

import * as FileSaver from 'file-saver';
import { startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import value from '*.png';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
  providers: [
    PrintService,
    V34Service,
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

export class PrintComponent implements OnInit, OnDestroy {

  PrintCondition: Print;

  public PrintForm: FormGroup = new FormGroup({
    beginDate: new FormControl(),
    endDate: new FormControl(),
    customer: new FormControl(),
    type: new FormControl(),
    variety: new FormControl(),
    brand: new FormControl(),
    company: new FormControl(),
    printCategory: new FormControl(),
    printType: new FormControl()
  });
  customerFilter$: Subscription;
  customerFilteredOptions: dict[];



  constructor(private adapter: DateAdapter<any>,
    public _PrintService: PrintService,
    private REST_v34: V34Service) {
    this.adapter.setLocale('zh-TW');
  }

  ngOnInit() {
    //Listen customerFilter
    this.REST_v34.GetV34().subscribe((data: v34[]) => {
      this.customerFilter$ = this.PrintForm.get('customer').valueChanges.pipe(startWith('')).subscribe(value => {

        this.customerFilteredOptions = this._autoFilter(
          data.filter(x => x.v3401 != null)
            .map(v => v.v3401.toString() + "; " + v.v3402.toString())
            .sort((a, b) => parseFloat(a) - parseFloat(b)),
          value
        );
      });
    })
  }

  ngOnDestroy() {
    this.customerFilter$.unsubscribe();
  }

  private _autoFilter(options: string[], value: string): dict[] {
    const filterValue = value.toLowerCase();
    var dict: dict[] = [];
    options = [...new Set(options)];//distinct the array  
    options.filter(option => option.toLowerCase().includes(filterValue)).forEach((x: string) => {
      dict.push({ key: x.split(';')[1].trim(), value: x.split(';')[0].trim() })
    });

    return dict
  }

  Print(PrintInfo: Print): void {
    console.log(PrintInfo);
    this._PrintService.GetExcel(PrintInfo).subscribe(response => {
      let filename = response.headers.get('Content-Disposition').split(/[;'=]/).pop();
      FileSaver.saveAs(response.body, decodeURIComponent(filename));
    })
  }

}

export class dict {
  key: string
  value: string
}