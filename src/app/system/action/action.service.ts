import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Action, Ctrl } from './action';
import { ActionNode } from '../character/character';
import { environment } from '../../../environments/environment';

@Injectable()
export class ActionService {

    private readonly RestfulApiUrl_Action: string = environment.ApiUrl_Auth + 'Actions';
    
    constructor(private http: HttpClient) { }
   
    //#region Actions RESTful APIs
    GetActionTree() {
        return this.http.get<ActionNode[]>(this.RestfulApiUrl_Action + "/GetActionTree" );
    }

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
}

@Injectable()
export class CtrlService {
    private readonly RestfulApiUrl_Ctrl: string = environment.ApiUrl_Auth + 'Ctrls';

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