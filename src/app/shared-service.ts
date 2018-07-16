import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//----ViewModel----//
import { vmNavMenu } from './navmenu/navmenu';

@Injectable()
export class SharedService {

    // Observable string sources
    private emitChangeSource = new Subject<any>();
    private emitChildRoutesSource = new Subject<vmNavMenu[]>();

    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    ChildRoutesEmitted$ = this.emitChildRoutesSource.asObservable();

    public AllowMenuApiUrl: string = 'http://192.168.1.170/FarmerAPI/api/System/GetAllowedMenu';

    constructor(private http: HttpClient) { }

    // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }
    emitChildRoutes(event: object) {
        this.http.get<vmNavMenu[]>(this.AllowMenuApiUrl).subscribe((menus: vmNavMenu[]) => {
            let ParentMenu = menus.find(x => x.component === event.constructor.name);
            if (ParentMenu.children) {
                //console.log(ParentMenu);                
                this.emitChildRoutesSource.next(ParentMenu.children);
            }
        });
    }
}