import { Subject } from 'rxjs';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

//----ViewModel----//
import { vmNavMenu } from './navmenu/navmenu';

@Injectable()
export class SharedService {
    private readonly AllowMenuApiUrl: string = environment.apiUrl + 'System/GetAllowedMenu';

    // Observable string sources
    private emitChangeSource = new Subject<any>();
    private emitChildRoutesSource = new Subject<vmNavMenu[]>();

    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    ChildRoutesEmitted$ = this.emitChildRoutesSource.asObservable();
    
    public factories: any = [];

    constructor(private http: HttpClient, private resolver: ComponentFactoryResolver) { 
        this.factories = Array.from(this.resolver['_factories'].values());
    }

    // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }

    emitChildRoutes(event: Object) {
        this.http.get<vmNavMenu[]>(this.AllowMenuApiUrl).subscribe((menus: vmNavMenu[]) => {
            
            /**ng build --prod會化簡component的名字減省空間，但不會改selector名字！
             * 所以利用ComponentFactoryResolver抓此event的selector 
             * 接著與資料庫比對是event是按下哪個component後，回傳此component的child清單*/
            let ParentProto: any = Object.getPrototypeOf(event);           
            var Parentfactory: any = this.GetComponentType(ParentProto.constructor.name);
            let ParentMenu = menus.filter(x=>x.selector!=null).find(x => x.selector === Parentfactory.selector);
           
            if (ParentMenu && ParentMenu.children != null) {
                this.emitChildRoutesSource.next(ParentMenu.children);
            }
        });
    }

    private GetComponentType(routeName: string): any {
        // 根據 componentType 名字取出對應的 componentType
        let factory: any = this.factories.find(
            (x: any) => {
                return x.componentType.name == routeName;
            }
        );
        return factory;
    }

}