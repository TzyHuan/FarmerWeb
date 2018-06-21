import { Component, ComponentFactoryResolver, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MenuService } from './navmenu.service';
import { vmMenu } from './navmenu';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { SharedService } from '../shared-service';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { Observer, Observable, Subscriber } from 'rxjs';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css'],
    providers: [MenuService] //SharedService已在app.module
})

export class NavMenuComponent {

    private MenuList: vmMenu[];
    private SignList: vmMenu[];
    private isSignIn: boolean;
    private timeNow: Observable<string>;

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

        //監聽從sign-in.component.ts傳來觸發事件，登入時重新抓Routes
        _sharedService.changeEmitted$.subscribe(
            text => {
                console.log(text);
                this.RebuildRoutes();
            }
        );
    }

    ngOnInit() {
        var options = {
            //year: "numeric", month: "short", day: "numeric",
            hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
            //weekday: "short",
        };
        //1.直接設定param類型為Observable
        this.timeNow = new Observable<string>((observer: Subscriber<string>) => {
            setInterval(() => observer.next(
                //反應速度差不多
                new Date().toLocaleTimeString('zh-TW', options)
            ), 1000);
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
                console.log("RebuildRoutes success!!")
            },
            error => console.error(error)
        )
    }
}
