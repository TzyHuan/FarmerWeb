import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { RoleGroup, ImemRole, ImenuRole } from './character'

@Injectable()
export class CharacterService {

    public RestfulApiUrl_RoleGroup: string = 'http://192.168.1.170/FarmerAPI/api/Menus';
    public RestfulApiUrl_ImemRole: string = 'http://192.168.1.170/FarmerAPI/api/Menus';
    public RestfulApiUrl_ImenuRole: string = 'http://192.168.1.170/FarmerAPI/api/Menus';
    
    constructor(private http: HttpClient) { }
    
    //#region RoleGroup RESTful API
    GetRoleGroup() {
        return this.http.get<RoleGroup[]>(this.RestfulApiUrl_RoleGroup);
    }

    GetOneRoleGroup(id: number) {
        return this.http.get<RoleGroup[]>(this.RestfulApiUrl_RoleGroup + "/" + id);
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

    //#region ImemRole RESTful API
    GetImemRole() {
        return this.http.get<ImemRole[]>(this.RestfulApiUrl_ImemRole);
    }

    GetOneImemRole(id: string) {
        return this.http.get<ImemRole[]>(this.RestfulApiUrl_ImemRole + "/" + id);
    }

    PostImemRole(body: ImemRole) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<ImemRole>(this.RestfulApiUrl_ImemRole, body, { headers });
    }

    PutImemRole(id: string, body: ImemRole) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.put<ImemRole>(this.RestfulApiUrl_ImemRole + "/" + id, body, { headers });
    }

    DeleteImemRole(id: number) {
        return this.http.delete<ImemRole>(this.RestfulApiUrl_ImemRole + "/" + id);
    }
    //#endregion

    //#region ImenuRole RESTful API
    GetImenuRole() {
        return this.http.get<ImenuRole[]>(this.RestfulApiUrl_ImemRole);
    }

    GetOneImenuRole(id: number) {
        return this.http.get<ImenuRole[]>(this.RestfulApiUrl_ImenuRole + "/" + id);
    }

    PostImenuRole(body: ImenuRole) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<ImenuRole>(this.RestfulApiUrl_ImenuRole, body, { headers });
    }

    PutImenuRole(id: number, body: ImenuRole) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.put<ImenuRole>(this.RestfulApiUrl_ImenuRole + "/" + id, body, { headers });
    }

    DeleteImenuRole(id: number) {
        return this.http.delete<ImenuRole>(this.RestfulApiUrl_ImenuRole + "/" + id);
    }
    //#endregion
}