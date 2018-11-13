import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class GpioService {
    public ApiUrl_Gpio: string = environment.ApiUrl_RaspGpio;

    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    });

    constructor(private http: HttpClient) { }

    setGpio(onoff: number) {
        // const params = new HttpParams()
        //     .set('minLat', minLat.toString())
        //     .set('maxLag', maxLag.toString())
        //     .set('minLng', minLng.toString())
        //     .set('maxLng', maxLng.toString());
        return this.http.get(this.ApiUrl_Gpio + onoff.toString());
    }

}