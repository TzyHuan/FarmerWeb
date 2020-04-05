import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Action } from '../../interface/system_auth/action';
import { ActionNode } from '../../interface/system_auth/vm_i_role';
import { environment } from '../../environments/environment';

@Injectable()
export class ActionService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
    });

    constructor(private http: HttpClient) { }

    getActionTree() {
        return this.http.get<ActionNode[]>(`${environment.authUrl}/Actions/GetActionTree`);
    }

    getActions() {
        return this.http.get<Action[]>(`${environment.authUrl}/Actions`);
    }

    getOneAction(id: number) {
        return this.http.get<Action[]>(`${environment.authUrl}/Actions/${id}`);
    }

    postAction(body: Action) {
        return this.http.post<Action>(`${environment.authUrl}/Actions`, body, { headers: this.headers });
    }

    putAction(id: number, body: Action) {
        return this.http.put<Action>(`${environment.authUrl}/Actions/${id}`, body, { headers: this.headers });
    }

    deleteAction(id: number) {
        return this.http.delete<Action>(`${environment.authUrl}/Actions/${id}`);
    }
}
