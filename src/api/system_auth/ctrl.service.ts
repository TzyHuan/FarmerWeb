import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ctrl } from '../../interface/system_auth/ctrl';
import { environment } from '../../environments/environment';

@Injectable()
export class CtrlService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
    });

    constructor(private http: HttpClient) { }

    getCtrls() {
        return this.http.get<Ctrl[]>(`${environment.authUrl}/Ctrls`);
    }

    getOneCtrl(id: number) {
        return this.http.get<Ctrl[]>(`${environment.authUrl}/Ctrls/${id}`);
    }

    postCtrl(body: Ctrl) {
        return this.http.post<Ctrl>(`${environment.authUrl}/Ctrls`,
            body,
            { headers: this.headers },
        );
    }

    putCtrl(id: number, body: Ctrl) {
        return this.http.put<Ctrl>(`${environment.authUrl}/Ctrls/${id}`,
            body,
            { headers: this.headers },
        );
    }

    deleteCtrl(id: number) {
        return this.http.delete<Ctrl>(`${environment.authUrl}/Ctrls/${id}`);
    }
}
