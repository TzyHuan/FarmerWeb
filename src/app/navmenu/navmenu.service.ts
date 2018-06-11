import { Injectable } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

import { vmMenu } from './navmenu'

@Injectable()
export class MenuService {
    public AllowMenuApiUrl: string = 'http://192.168.1.170/FarmerAPI/api/System/GetAllowedMenu';

    constructor(private http: HttpClient) { }

    getAllowedMenu(headers: HttpHeaders) {
        return this.http.get<vmMenu[]>(this.AllowMenuApiUrl, { headers });
    }
}
