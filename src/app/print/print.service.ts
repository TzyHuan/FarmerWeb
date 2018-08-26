import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Print } from './print';
import { map } from 'rxjs/operators'

@Injectable()
export class PrintService {
    public ApiUrl_print: string = environment.apiUrl + 'Print';
    //public ApiUrl_print: string = "http://localhost:4064/api/Print";

    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    });

    constructor(private http: HttpClient) { }
    
    GetExcel(Info:Print) {
        
        let BeginDate:string = Info.beginDate.toLocaleDateString('zh-TW');
        let EndDate:string = Info.endDate.toLocaleDateString('zh-TW');
       
        const params = new HttpParams()
            .set('Customer', Info.customer)
            .set('Variety', Info.variety)
            .set('Type', Info.type)
            .set('Brand', Info.brand)
            .set('PrintType', Info.printType)
            .set('ProductName', Info.productName)
            .set('Company', Info.company)
            .set('BeginDate', BeginDate)
            .set('EndDate', EndDate);

        return this.http.get(this.ApiUrl_print +'/DemoGet',{params, responseType:'blob',observe:'response'});
    }
   
}