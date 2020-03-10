import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMenuRole } from '../../interface/system_auth/i_menu_role';
import { environment } from '../../environments/environment';

@Injectable()
export class IMenuRoleService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    });

    constructor(private http: HttpClient) { }

    getIMenuRole() {
        return this.http.get<IMenuRole[]>(`${environment.authUrl}/IMenuRoles`);
    }

    getOneIMenuRole(id: number) {
        return this.http.get<IMenuRole>(`${environment.authUrl}/IMenuRoles/${id}`);
    }

    postIMenuRole(body: IMenuRole) {
        return this.http.post<IMenuRole>(
            `${environment.authUrl}/IMenuRoles`,
            body,
            { headers: this.headers });
    }

    deleteIMenuRole(menuId: number, roleId: number) {
        return this.http.delete<IMenuRole>(`${environment.authUrl}/IMenuRoles/${menuId}/${roleId}`);
    }
}
