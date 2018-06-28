
import {throwError as observableThrowError,  Observable, Subscriber, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { catchError,retryWhen } from 'rxjs/operators';

import { WeatherStation, HighchartsTempratures, HighchartsHumidities } from './climate'

@Injectable()
export class ClimateService {
    public StationApiUrl: string = 'http://192.168.1.170/FarmerAPI/api/WeatherData/Stations';
    public TemperatuteApiUrl: string = 'http://192.168.1.170/FarmerAPI/api/WeatherData/Temperatures';
    public HumiditiesApiUrl: string = 'http://192.168.1.170/FarmerAPI/api/WeatherData/Humidities';

    constructor(private http: HttpClient) { }

    getSelectItem() {
        return this.http.get<WeatherStation[]>(this.StationApiUrl)
        //rxjs 6 語法不同，todo
            // .retryWhen(error => {
            //     return error
            //         // .mergeMap((error: any) => {
            //         //     if (error.status === 503) {
            //         //         return of(error.status);
            //         //     }
            //         //     return observableThrowError({ error: 'No retry' });
            //         // })
            // })
            // .take(5)
            //.concat(Observable.throw({ error: 'Sorry, there was an error (after 5 retries)' }))
    }

    getTemperatures(params?: HttpParams) {
        return this.http.get<HighchartsTempratures[]>(this.TemperatuteApiUrl, { params })
    }

    getRelativeHumidities(params?: HttpParams) {
        return this.http.get<HighchartsHumidities[]>(this.HumiditiesApiUrl, { params })
    }
}