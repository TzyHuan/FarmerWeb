import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GpioStatus } from './rasp_gpio';

@Injectable()
export class GpioService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    });

    constructor(private http: HttpClient) { }

    putGpio(pin: number, onoff: number) {
        return this.http.put(
            `${environment.raspGpioUrl}/${pin.toString()}`,
            {
                onoff: onoff,
            },
            { headers: this.headers },
        );
    }

    getGpioStatus(pin: number) {
        return this.http.get(`${environment.raspGpioUrl}/${pin.toString()}/status`);
    }

    getAllGpioStatus() {
        return this.http.get(`${environment.raspGpioUrl}/status`);
    }

    putPwm(pin: number, freq: number, duty: number) {
        return this.http.put(
            `${environment.raspPwmUrl}/${pin}`,
            {
                freq: freq,
                duty: duty * 3000,
            },
            { headers: this.headers },
        );
    }
}
