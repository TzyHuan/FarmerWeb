import { Injectable } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber, Subject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Menu } from './menu'

@Injectable()
export class MenuService {

    public RestfulApiUrl_Menu: string = 'http://192.168.1.170/FarmerAPI/api/Menus';

    constructor(private http: HttpClient) { }

    //#region Transfer asyc parameter between menu.component and menu-create.component
    // Observable string sources
    private emitChangeSource = new Subject<any>();
    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }
    //#endregion
    
    //#region RESTful APIs
    GetMenu() {
        return this.http.get<Menu[]>(this.RestfulApiUrl_Menu);
    }

    GetOneMenu(id: number) {
        return this.http.get<Menu[]>(this.RestfulApiUrl_Menu + "/" + id);
    }

    PostMenu(body: Menu) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<Menu>(this.RestfulApiUrl_Menu, body, { headers });
    }

    PutMenu(id: number, body: Menu) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.put<Menu>(this.RestfulApiUrl_Menu + "/" + id, body, { headers });
    }

    DeleteMenu(id: number) {
        return this.http.delete<Menu>(this.RestfulApiUrl_Menu + "/" + id);
    }
    //#endregion
}