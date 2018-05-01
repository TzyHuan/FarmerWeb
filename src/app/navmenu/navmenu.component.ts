import { Component } from '@angular/core';
//import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { MenuService } from './navmenu.service';
import { vmMenu } from './navmenu'

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css'],
    providers: [MenuService]
})
export class NavMenuComponent {
    public test: string;
    public MenuList: vmMenu[];

    constructor(private navmenuREST:MenuService) {
        this.test = 'Climate';

        this.navmenuREST.getAllowedMenu(1).subscribe(
            (result: vmMenu[]) => {
                this.MenuList = result;
                console.log(this.MenuList);
            },
            error => console.error(error)
        )
    }
}
