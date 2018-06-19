import { Component, ComponentFactoryResolver, Injectable, Input } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MenuService } from './navmenu.service';
import { vmMenu } from './navmenu';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { SharedService } from '../shared-service';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css'],
    providers: [MenuService] //SharedService已在app.module
})

export class NavMenuComponent {

    @Input() public MenuList: vmMenu[];
    @Input() public SignList: vmMenu[];
    public isSignIn: boolean;

    constructor(
        private MenuREST: MenuService,
        private reRouting: AppRoutingModule,
        private router: Router,
        private resolver: ComponentFactoryResolver,
        private _sharedService: SharedService
    ) {

        if (localStorage.getItem('userToken') == null) {
            this.isSignIn = false;
        }
        else if (localStorage.getItem('userToken') != null) {
            this.isSignIn = true;
        }

        this.RebuildRoutes();

        //登入時，從sign-in.component.ts傳來觸發事件，重新抓Routes
        _sharedService.changeEmitted$.subscribe(
            text => {
                console.log(text);
                this.RebuildRoutes();
            });
    }

    SignOut() {
        localStorage.removeItem("userToken");
        this.isSignIn = false;

        this.RebuildRoutes();
    }

    RebuildRoutes() {
        this.reRouting.factories = Array.from(this.resolver['_factories'].values());
        this.MenuREST.getAllowedMenu().subscribe(
            (result: vmMenu[]) => {
                this.router.resetConfig(this.reRouting.processRoute(result, this.reRouting.factories));
                this.MenuList = result.filter(menu => !menu.path.startsWith('Sign'));
                this.SignList = result.filter(menu => menu.path.startsWith('Sign'));
                console.log("rebuildRoutes success!!")
            },
            error => console.error(error)
        )
    }
}
