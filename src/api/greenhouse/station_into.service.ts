
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StationInfo } from '../../interface/greenhouse/station_info';

@Injectable()
export class StationInfoService {

    constructor(private http: HttpClient) { }

    getStationInfo() {
        return this.http.get<StationInfo[]>(
            `${environment.greenhouseUrl}/StationInfo`,
        );
    }
}
