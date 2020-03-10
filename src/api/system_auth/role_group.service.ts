import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleGroup } from '../../interface/system_auth/role_group';
import { RoleGroupNode } from '../../interface/system_auth/vm_i_role';
import { environment } from '../../environments/environment';

@Injectable()
export class RoleGroupService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
    });

    constructor(private http: HttpClient) { }

    getRoleGroupTree() {
        return this.http.get<RoleGroupNode[]>(`${environment.authUrl}/RoleGroups/GetRoleGroupTree`);
    }

    getRoleGroup() {
        return this.http.get<RoleGroup[]>(`${environment.authUrl}/RoleGroups`);
    }

    getOneRoleGroup(id: number) {
        return this.http.get<RoleGroup>(`${environment.authUrl}/RoleGroups/${id}`);
    }

    postRoleGroup(body: RoleGroup) {
        return this.http.post<RoleGroup>(
            `${environment.authUrl}/RoleGroups`,
            body,
            { headers: this.headers },
        );
    }

    putRoleGroup(id: number, body: RoleGroup) {
        return this.http.put<RoleGroup>(
            `${environment.authUrl}/RoleGroups/${id}`,
            body,
            { headers: this.headers },
        );
    }

    deleteRoleGroup(id: number) {
        return this.http.delete<RoleGroup>(`${environment.authUrl}/RoleGroups/${id}`);
    }
}


