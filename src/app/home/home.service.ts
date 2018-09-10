import { Injectable } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RealtimeData } from './home';

@Injectable()
export class HomeService {
    //API URL//
    public RealtimeApiUrl: string = environment.ApiUrl_Farmer + 'values/Realtime/';    

    // public httpOptions = {
    //     headers: new HttpHeaders({
    //         'Content-Type': 'application/json', //'application/x-www-form-urlencoded'//,//
    //         'Access-Control-Allow-Origin':'*'
    //     })
    // };    

    constructor(private http: HttpClient) {
    }

    /** GET realtime data from the server */
    getRealtimeData(stationId:number): Observable<RealtimeData> {        
        return this.http.get<RealtimeData>(this.RealtimeApiUrl+stationId);
    }

    //////// Save methods (test)//////////
    /** PUT: update the data on the server. Returns the updated data upon success. */
    updateRealtime(data: RealtimeData): any {      

        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        })        
        //.append('Accept','application/json, text/plain')  
        //.append('Content-Type', 'x-www-form-urlencoded')

        
        return this.http.post<RealtimeData>(
            "http://localhost/FarmerAPI/api/values/Realtime/3", data, { headers }
        );

        //Another way to call web api
        // const body = new HttpParams()
        //     .set('StationId', data.StationId.toString())
        //     .set('RecTemp', data.RecTemp.toString())
        //     .set('RecRH', data.RecRH.toString());
        // return this.http
        // .request("post","http://localhost/FarmerAPI/api/values/Realtime/3", 
        //     {
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
        //         //responseType:"json", //會增加Accept: application/json, text/plain, */*
        //         //params:body   
        // });
    }

}