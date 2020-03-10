import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { status } from './rasp_gpio';

@Injectable()
export class GpioService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    });

    constructor(private http: HttpClient) { }

    setGpio(pin: number, onoff: number | string) {
        return this.http.get<boolean>(
            `${environment.raspGpioUrl}/${pin.toString()}/set/${onoff.toString()}`,
        );
    }

    readGpioStatus(pin: number) {
        return this.http.get<status>(
            `${environment.raspGpioUrl}/${pin.toString()}/status`,
        );
    }

    readAllGpioStatus(pins: any[]) {
        return this.http.post<status>(
            `${environment.raspGpioUrl}/status`,
            pins,
            { headers: this.headers },
        );
    }
}