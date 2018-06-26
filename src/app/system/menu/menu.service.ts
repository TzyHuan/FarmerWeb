import { Injectable } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'

import { Menu } from './menu'

@Injectable()
export class MenuService {
    public ApiUrl_GetMenu: string = 'http://192.168.1.170/FarmerAPI/api/Menus';

    constructor(private http: HttpClient) { }

    GetMenu() {
        return this.http.get<Menu[]>(this.ApiUrl_GetMenu);
    }
}
