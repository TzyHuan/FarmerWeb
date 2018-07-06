import { Injectable } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Menu } from './menu'

@Injectable()
export class MenuService {

    private readonly RestfulApiUrl_Menu: string = 'http://192.168.1.170/FarmerAPI/api/Menus';
    public dataChange: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([]);

    constructor(private http: HttpClient) { }

    get data(): Menu[] {
        // console.log('MenuService-get-data:');
        // console.log(this.dataChange.getValue());
        return this.dataChange.value;
    }

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
    GetAllMenu():void{
        this.http.get<Menu[]>(this.RestfulApiUrl_Menu).subscribe(data=>{
            this.dataChange.next(data);
            console.log(this.dataChange);
            console.log(this.dataChange.getValue());
            console.log(this.dataChange.value);
        },
        (error:HttpErrorResponse)=>{
            console.log(error.name+':'+error.message);
        });
    }

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