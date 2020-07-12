
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Climate } from '../../interface/greenhouse/climate';

@Injectable()
export class ClimateService {

    constructor(private http: HttpClient) { }

    getGreenhouseClimate(searchNum: number = 10000) {
        const params = new HttpParams()
            .set('SearchNum', String(searchNum));
        return this.http.get<Climate[]>(
            `${environment.greenhouseUrl}/Climate/Greenhouse`,
            { params },
        );
    }

    getCwbClimate(stationId: number, searchNum: number = 10000) {
        const params = new HttpParams()
            .set('StationId', String(stationId))
            .set('SearchNum', String(searchNum));
        return this.http.get<Climate[]>(
            `${environment.greenhouseUrl}/Climate/Cwb`,
            { params },
        );
    }
}
