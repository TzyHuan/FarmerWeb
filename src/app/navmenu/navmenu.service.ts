import { Injectable } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { vmNavMenu } from './navmenu'

@Injectable()
export class NavMenuService {
    public AllowMenuApiUrl: string = environment.apiUrl + 'System/GetAllowedMenu';

    constructor(private http: HttpClient) { }

    getAllowedMenu() {
        return this.http.get<vmNavMenu[]>(this.AllowMenuApiUrl);
    }
}
