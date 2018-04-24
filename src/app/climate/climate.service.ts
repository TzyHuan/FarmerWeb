import { Injectable } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

import { WeatherStation, HighchartsData } from './climate'

@Injectable()
export class ClimateService {
    public StationApiUrl: string = 'http://localhost/FarmerAPI/api/weatherData/Stations';
    public TemperatuteApiUrl: string = 'http://localhost/FarmerAPI/api/weatherData/Temperatures';

    constructor(private http: HttpClient) { }

    getSelectItem() {
        return this.http.get<WeatherStation[]>(this.StationApiUrl)
    }

    getTemperatute(params?: HttpParams) {
        return this.http.get<HighchartsData[]>(this.TemperatuteApiUrl, { params })
    }
}