import { Component } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
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
    public SignList: vmMenu[];
    public headers: HttpHeaders;    
    public token:string='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJHZW5lcmFsIiwiaXNzIjoi55CG5p-l5b635LqC5pCe5pyJ6ZmQ5YWs5Y-4IiwiaWQiOiJhbmR5ODE3MTkiLCJyb2xlSWQiOiIxIiwibmJmIjoxNTI3OTE0NjY3LCJleHAiOjE3NDg4Mzk0NjcsImlhdCI6MTUyNzkxNDY2N30.bS5KsmqMAOk3eORybL6IJZC_yo78lH3RIKChf7vebkM';

    constructor(private navmenuREST: MenuService) {
        //this.test = 'Climate';
        this.headers = new HttpHeaders({           
            'Authorization': this.token
          });
        
        //this.headers.append('Authorization', );


        this.navmenuREST.getAllowedMenu(this.headers).subscribe(
            (result: vmMenu[]) => {
                this.MenuList = result.filter(menu=>!menu.menuText.startsWith('Sign'));
                console.log(this.MenuList);
                this.SignList = result.filter(menu=>menu.menuText.startsWith('Sign'));
                console.log(this.SignList);
            },
            error => console.error(error)
        )
    }
}
