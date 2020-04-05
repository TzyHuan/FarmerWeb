
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HighchartsTempratures, HighchartsHumidities } from '../../interface/greenhouse/climate';

@Injectable()
export class ClimateService {

    constructor(private http: HttpClient) { }

    getTemperatures(params?: HttpParams) {
        return this.http.get<HighchartsTempratures[]>(
            `${environment.greenhouseUrl}/Climate/Temperatures`,
            { params },
        );
    }

    getRelativeHumidities(params?: HttpParams) {
        return this.http.get<HighchartsHumidities[]>(
            `${environment.greenhouseUrl}/Climate/Humidities`,
            { params },
        );
    }
}
