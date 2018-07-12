import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleGroup, ImenuRole } from './character';
import { MenuNode } from '../menu/menu';

@Injectable()
export class CharacterService {

    public RestfulApiUrl_RoleGroup: string = 'http://192.168.1.170/FarmerAPI/api/RoleGroups';
    public RestfulApiUrl_ImenuRole: string = 'http://192.168.1.170/FarmerAPI/api/ImenuRoles';
    
    constructor(private http: HttpClient) { }
    
    //#region RoleGroup RESTful API
    GetRoleGroup() {
        return this.http.get<RoleGroup[]>(this.RestfulApiUrl_RoleGroup);
    }

    GetOneRoleGroup(id: number) {
        return this.http.get<RoleGroup>(this.RestfulApiUrl_RoleGroup + "/" + id);
    }

    PostRoleGroup(body: RoleGroup) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<RoleGroup>(this.RestfulApiUrl_RoleGroup, body, { headers });
    }

    PutRoleGroup(id: number, body: RoleGroup) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.put<RoleGroup>(this.RestfulApiUrl_RoleGroup + "/" + id, body, { headers });
    }

    DeleteRoleGroup(id: number) {
        return this.http.delete<RoleGroup>(this.RestfulApiUrl_RoleGroup + "/" + id);
    }
    //#endregion

    //#region ImenuRole RESTful API  
    GetImenuRole() {
        return this.http.get<ImenuRole[]>(this.RestfulApiUrl_ImenuRole);
    }

    GetOneImenuRole(id: number) {
        return this.http.get<ImenuRole>(this.RestfulApiUrl_ImenuRole + "/" + id);
    }

    PostImenuRole(body: ImenuRole) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<ImenuRole>(this.RestfulApiUrl_ImenuRole, body, { headers });
    }

    DeleteImenuRole(MenuId: number, RoleId:number) {
        return this.http.delete<ImenuRole>(this.RestfulApiUrl_ImenuRole + "/" + MenuId + "/" + RoleId);
    }
    //#endregion
}