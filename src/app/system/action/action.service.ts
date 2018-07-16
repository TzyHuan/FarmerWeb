import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Action, Ctrl } from './action'

@Injectable()
export class ActionService {

    private readonly RestfulApiUrl_Action: string = 'http://192.168.1.170/FarmerAPI/api/Actions';
    private readonly RestfulApiUrl_Ctrl: string = 'http://192.168.1.170/FarmerAPI/api/Ctrls';
    
    constructor(private http: HttpClient) { }
   
    //#region Actions RESTful APIs
    GetActions() {
        return this.http.get<Action[]>(this.RestfulApiUrl_Action);
    }

    GetOneAction(id: number) {
        return this.http.get<Action[]>(this.RestfulApiUrl_Action + "/" + id);
    }

    PostAction(body: Action) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<Action>(this.RestfulApiUrl_Action, body, { headers });
    }

    PutAction(id: number, body: Action) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.put<Action>(this.RestfulApiUrl_Action + "/" + id, body, { headers });
    }

    DeleteAction(id: number) {
        return this.http.delete<Action>(this.RestfulApiUrl_Action + "/" + id);
    }
    //#endregion

    //#region Ctrls RESTful APIs    
    GetCtrls() {
        return this.http.get<Ctrl[]>(this.RestfulApiUrl_Ctrl);
    }

    GetOneCtrl(id: number) {
        return this.http.get<Ctrl[]>(this.RestfulApiUrl_Ctrl + "/" + id);
    }

    PostCtrl(body: Ctrl) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<Ctrl>(this.RestfulApiUrl_Ctrl, body, { headers });
    }

    PutCtrl(id: number, body: Ctrl) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.put<Ctrl>(this.RestfulApiUrl_Ctrl + "/" + id, body, { headers });
    }

    DeleteCtrl(id: number) {
        return this.http.delete<Ctrl>(this.RestfulApiUrl_Ctrl + "/" + id);
    }
    //#endregion
}

@Injectable()
export class CtrlService {
    private readonly RestfulApiUrl_Ctrl: string = 'http://192.168.1.170/FarmerAPI/api/Ctrls';

    constructor(private http: HttpClient) { }
    
    //#region Ctrls RESTful APIs    
    GetCtrls() {
        return this.http.get<Ctrl[]>(this.RestfulApiUrl_Ctrl);
    }

    GetOneCtrl(id: number) {
        return this.http.get<Ctrl[]>(this.RestfulApiUrl_Ctrl + "/" + id);
    }

    PostCtrl(body: Ctrl) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<Ctrl>(this.RestfulApiUrl_Ctrl, body, { headers });
    }

    PutCtrl(id: number, body: Ctrl) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.put<Ctrl>(this.RestfulApiUrl_Ctrl + "/" + id, body, { headers });
    }

    DeleteCtrl(id: number) {
        return this.http.delete<Ctrl>(this.RestfulApiUrl_Ctrl + "/" + id);
    }
    //#endregion
}