import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthRequest } from '../../interface/system_auth/auth_request';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {
    }

    userAuthentication(userName: string, password: string) {
        let data: AuthRequest = {
            account: userName,
            password: password,
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        })
        return this.http.post(
            `${environment.authUrl}/Auth/Authenticate`,
            data,
            { headers },
        );
    }
}
