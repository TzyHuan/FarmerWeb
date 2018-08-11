import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { v34 } from './v34';

@Injectable()
export class V34Service {
    public ApiUrl_v34: string = environment.apiUrl + 'V34';
    //public ApiUrl_v34: string = "https://localhost:44321/api/V34";

    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    });

    constructor(private http: HttpClient) { }

    GetInsideBound(minLat: number, maxLag: number, minLng: number, maxLng: number) {
        const params = new HttpParams()
            .set('minLat', minLat.toString())
            .set('maxLag', maxLag.toString())
            .set('minLng', minLng.toString())
            .set('maxLng', maxLng.toString());
        return this.http.get<v34[]>(this.ApiUrl_v34 + "/GetInsideBound", { params });
    }
    GetV34() {
        return this.http.get<v34[]>(this.ApiUrl_v34);
    }
    GetOneV34(V3401: string, V3404: number) {
        return this.http.get<v34[]>(this.ApiUrl_v34 + "/" + V3401 + "/" + V3404);
    }
    PutV34(V3401: string, V3404: number, body: v34) {
        return this.http.put<v34>(
            this.ApiUrl_v34 + "/" + V3401 + "/" + V3404,
            body,
            { headers: this.headers }
        );
    }
    PostV34(body: v34) {
        return this.http.post<v34>(this.ApiUrl_v34, body, { headers: this.headers });
    }
    DeleteV34(V3401: string, V3404: number) {
        return this.http.delete<v34>(this.ApiUrl_v34 + "/" + V3401 + "/" + V3404);
    }

}