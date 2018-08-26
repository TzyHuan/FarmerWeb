import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleGroup, ImenuRole, IactionRole, ImemRole, RoleGroupNode } from './character';
import { environment } from '../../../environments/environment';

@Injectable()
export class CharacterService {
    public RestfulApiUrl_RoleGroup: string = environment.apiUrl + 'RoleGroups';
  
    constructor(private http: HttpClient) { }
    
    //#region RoleGroup RESTful API
    GetRoleGroupTree() {
        return this.http.get<RoleGroupNode[]>(this.RestfulApiUrl_RoleGroup + "/GetRoleGroupTree" );
    }

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
}

@Injectable()
export class ImenuRolesService {
    public RestfulApiUrl_ImenuRole: string = environment.apiUrl + 'ImenuRoles';
    
    constructor(private http: HttpClient) { }

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

@Injectable()
export class IactionRolesService {
    public RestfulApiUrl_IactionRole: string = 'http://192.168.1.170/FarmerAPI/api/IactionRoles';
    
    constructor(private http: HttpClient) { }

    //#region ImenuRole RESTful API  
    GetIactionRole() {
        return this.http.get<IactionRole[]>(this.RestfulApiUrl_IactionRole);
    }

    GetOneIactionRole(id: number) {
        return this.http.get<IactionRole>(this.RestfulApiUrl_IactionRole + "/" + id);
    }

    PostIactionRole(body: IactionRole) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<IactionRole>(this.RestfulApiUrl_IactionRole, body, { headers });
    }

    DeleteIactionRole(ActionId: number, RoleId:number) {
        return this.http.delete<IactionRole>(this.RestfulApiUrl_IactionRole + "/" + ActionId + "/" + RoleId);
    }
    //#endregion
}

@Injectable()
export class ImemRoleService {

    public RestfulApiUrl_ImemRole: string = 'http://192.168.1.170/FarmerAPI/api/ImemRoles';
    
    constructor(private http: HttpClient) { }
    
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

    DeleteImemRole(account:string, id: number) {
        return this.http.delete<ImemRole>(this.RestfulApiUrl_ImemRole + "/" + account + "/" + id);
    }
    //#endregion   
}