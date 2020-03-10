import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IActionRole } from '../../interface/system_auth/i_action_role';
import { environment } from '../../environments/environment';

@Injectable()
export class IActionRoleService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
    });

    constructor(private http: HttpClient) { }

    getIActionRole() {
        return this.http.get<IActionRole[]>(`${environment.authUrl}/IActionRoles`);
    }

    getOneIActionRole(id: number) {
        return this.http.get<IActionRole>(`${environment.authUrl}/IActionRoles/${id}`);
    }

    postIActionRole(body: IActionRole) {
        return this.http.post<IActionRole>(
            `${environment.authUrl}/IActionRoles`,
            body,
            { headers: this.headers },
        );
    }

    deleteIActionRole(actionId: number, roleId: number) {
        return this.http.delete<IActionRole>(`${environment.authUrl}/IActionRoles/${actionId}/${roleId}`);
    }
}
