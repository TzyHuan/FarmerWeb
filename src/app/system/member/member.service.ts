import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Member } from './member';
import { environment } from '../../../environments/environment';

@Injectable()
export class MemberService {

    public RestfulApiUrl_Member: string = environment.ApiUrl_Auth + 'Members';
    
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
