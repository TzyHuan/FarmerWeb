import { Injectable } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

import { WeatherStation, HighchartsTempratures, HighchartsHumidities } from './climate'

@Injectable()
export class ClimateService {
    public StationApiUrl: string = 'http://192.168.1.170/FarmerAPI/api/WeatherData/Stations';
    public TemperatuteApiUrl: string = 'http://192.168.1.170/FarmerAPI/api/WeatherData/Temperatures';
    public HumiditiesApiUrl: string = 'http://192.168.1.170/FarmerAPI/api/WeatherData/Humidities';

    constructor(private http: HttpClient) { }

    getSelectItem() {
        return this.http.get<WeatherStation[]>(this.StationApiUrl)
    }

    getTemperatures(params?: HttpParams) {
        return this.http.get<HighchartsTempratures[]>(this.TemperatuteApiUrl, { params })
    }

    getRelativeHumidities(params?: HttpParams) {
        return this.http.get<HighchartsHumidities[]>(this.HumiditiesApiUrl, { params })
    }
}