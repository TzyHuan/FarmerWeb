import { Component, ComponentFactoryResolver, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NavMenuService } from './navmenu.service';
import { vmNavMenu } from './navmenu';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { SharedService } from '../shared-service';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { Observer, Observable, Subscriber } from 'rxjs';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css'],
    providers: [NavMenuService] //SharedService已在app.module
})

export class NavMenuComponent {

    public MenuList: vmNavMenu[];
    public SignList: vmNavMenu[];
    public isSignIn: boolean;
    public timeNow: Observable<string>;

    constructor(
        private MenuREST: NavMenuService,
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

        //雖然第一次執行時app.module.ts會自動執行app-routing.module.ts建立Routers
        //但需要刷新Menu的button，所以必須執行一次
        this.RebuildRoutes();

        //監聽從sign-in.component.ts傳來觸發事件，登入時重新抓Routes
        _sharedService.changeEmitted$.subscribe(
            text => {
                console.log(text);
                this.RebuildRoutes();

                if (localStorage.getItem('userToken') == null) {
                    this.isSignIn = false;
                }
                else if (localStorage.getItem('userToken') != null) {
                    this.isSignIn = true;
                }
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
        this.MenuREST.getAllowedMenu().subscribe(
            (result: vmNavMenu[]) => {
                this.router.resetConfig(this.reRouting.processRoute(result));
                this.MenuList = result.filter(menu => !menu.path.startsWith('Sign'));
                this.SignList = result.filter(menu => menu.path.startsWith('Sign'));
                console.log("RebuildRoutes success!!")
            },
            error => console.error(error)
        )
    }
}
