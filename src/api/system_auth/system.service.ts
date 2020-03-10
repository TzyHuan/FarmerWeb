import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { VmMenu } from '../../interface/system_auth/vm_menu';

@Injectable()
export class SystemService {

    constructor(private http: HttpClient) { }

    getAllowedMenu() {
        return this.http.get<VmMenu[]>(
            `${environment.authUrl}/System/GetAllowedMenu`,
        );
    }
}
