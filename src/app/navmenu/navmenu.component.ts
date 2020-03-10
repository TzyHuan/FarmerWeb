import { Component } from '@angular/core';
import { SystemService } from '../../api/system_auth/system.service';
import { VmMenu } from '../../interface/system_auth/vm_menu';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { SharedService } from '../shared-service';
import { Observable, Subscriber } from 'rxjs';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css'],
    providers: [SystemService] //SharedService已在app.module
})

export class NavMenuComponent {

    public menuList: VmMenu[];
    public signList: VmMenu[];
    public isSignIn: boolean;
    public timeNow: Observable<string>;

    constructor(
        private router: Router,
        private reRouting: AppRoutingModule,
        private systemService: SystemService,
        private sharedService: SharedService,
    ) {

        if (localStorage.getItem('userToken') == null) {
            this.isSignIn = false;
        }
        else if (localStorage.getItem('userToken') != null) {
            this.isSignIn = true;
        }

        //雖然第一次執行時app.module.ts會自動執行app-routing.module.ts建立Routers
        //但需要刷新Menu的button，所以必須執行一次
        this.rebuildRoutes();

        //監聽從sign-in.component.ts傳來觸發事件，登入時重新抓Routes
        this.sharedService.changeEmitted$.subscribe(text => {
            console.log(text);
            this.rebuildRoutes();

            if (localStorage.getItem('userToken') == null) {
                this.isSignIn = false;
            }
            else if (localStorage.getItem('userToken') != null) {
                this.isSignIn = true;
            }
        });
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

    signOut() {
        localStorage.removeItem("userToken");
        this.isSignIn = false;
        this.rebuildRoutes();
    }

    rebuildRoutes() {
        this.systemService.getAllowedMenu().subscribe((result: VmMenu[]) => {
            this.router.resetConfig(this.reRouting.processRoute(result));
            this.menuList = result.filter(menu => !menu.path.startsWith('Sign'));
            this.signList = result.filter(menu => menu.path.startsWith('Sign'));
            console.log("RebuildRoutes success!!");
        }, (error) => {
            console.error(error);
        });
    }
}
