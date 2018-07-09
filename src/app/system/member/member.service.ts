import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ImemRole } from './member';

@Injectable()
export class CharacterService {

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