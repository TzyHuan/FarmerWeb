import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ImemRole, Member } from './member';

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
}

@Injectable()
export class MemberService {

    public RestfulApiUrl_Member: string = 'http://192.168.1.170/FarmerAPI/api/Members';
    
    constructor(private http: HttpClient) { }
    
    //#region Member RESTful API
    GetMember() {
        return this.http.get<Member[]>(this.RestfulApiUrl_Member);
    }

    GetOneMember(id: string) {
        return this.http.get<Member>(this.RestfulApiUrl_Member + "/" + id);
    }

    PostMember(body: Member) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.post<Member>(this.RestfulApiUrl_Member, body, { headers });
    }

    PutMember(id: string, body: Member) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
        return this.http.put<Member>(this.RestfulApiUrl_Member + "/" + id, body, { headers });
    }

    DeleteMember(id: string) {
        return this.http.delete<Member>(this.RestfulApiUrl_Member + "/" + id);
    }
    //#endregion   
}
