import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { status } from './RaspGpio';

@Injectable()
export class GpioService {
    public ApiUrl_Gpio: string = environment.ApiUrl_RaspGpio;

    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    });

    constructor(private http: HttpClient) { }

    SetGpio(pin: number, onoff: number | string) {
        return this.http.get<boolean>(this.ApiUrl_Gpio + pin.toString() + "/set/" + onoff.toString());
    }

    ReadGpioStatus(pin: number) {
        return this.http.get<status>(this.ApiUrl_Gpio + pin.toString() + "/status");
    }

    ReadAllGpioStatus(pins: any[]) {
        return this.http.post<status>(this.ApiUrl_Gpio + "/status", pins, { headers: this.headers });
    }
}