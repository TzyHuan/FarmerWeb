import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RealtimeWeather } from '../../interface/greenhouse/realtime_weather';

@Injectable()
export class RealtimeService {

    constructor(private http: HttpClient) {
    }

    getRealtimeData(stationId: number) {
        return this.http.get<RealtimeWeather>(
            `${environment.greenhouseUrl}/Realtime/${stationId}`
        );
    }
}