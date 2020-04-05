import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Menu, MenuNode } from '../../interface/system_auth/menu';
import { environment } from '../../environments/environment';

@Injectable()
export class MenuService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    });

    constructor(private http: HttpClient) { }

    getMenuTree() {
        return this.http.get<MenuNode[]>(`${environment.authUrl}/Menus/GetMenuTree`);
    }

    getMenu() {
        return this.http.get<Menu[]>(`${environment.authUrl}/Menus`);
    }

    getOneMenu(id: number) {
        return this.http.get<Menu[]>(`${environment.authUrl}/Menus/${id}`);
    }

    postMenu(body: Menu) {
        return this.http.post<Menu>(`${environment.authUrl}/Menus`, body, { headers: this.headers });
    }

    putMenu(id: number, body: Menu) {

        return this.http.put<Menu>(`${environment.authUrl}/Menus/${id}`,
            body,
            { headers: this.headers },
        );
    }

    deleteMenu(id: number) {
        return this.http.delete<Menu>(`${environment.authUrl}/Menus/${id}`);
    }
}
