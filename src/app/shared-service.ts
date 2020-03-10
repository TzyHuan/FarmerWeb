import { Subject } from 'rxjs';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

//----ViewModel----//
import { VmMenu } from '../interface/system_auth/vm_menu';

@Injectable()
export class SharedService {
    // Observable string sources
    private emitChangeSource = new Subject<any>();
    private emitChildRoutesSource = new Subject<VmMenu[]>();

    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    childRoutesEmitted$ = this.emitChildRoutesSource.asObservable();

    public factories: any = [];

    constructor(private http: HttpClient, private resolver: ComponentFactoryResolver) {
        this.factories = Array.from(this.resolver['_factories'].values());
    }

    // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }

    emitChildRoutes(event: Object) {
        this.http.get<VmMenu[]>(
            `${environment.authUrl}/System/GetAllowedMenu`,
        ).subscribe((menus: VmMenu[]) => {
            /**ng build --prod會化簡component的名字減省空間，但不會改selector名字！
             * 所以利用ComponentFactoryResolver抓此event的selector 
             * 接著與資料庫比對是event是按下哪個component後，回傳此component的child清單*/
            let parentProto: any = Object.getPrototypeOf(event);
            var parentfactory: any = this.getComponentType(parentProto.constructor.name);
            let parentMenu = menus.filter(x => x.selector != null).find(x => x.selector === parentfactory.selector);

            if (parentMenu && parentMenu.children != null) {
                this.emitChildRoutesSource.next(parentMenu.children);
            }
        });
    }

    private getComponentType(routeName: string): any {
        // 根據 componentType 名字取出對應的 componentType
        let factory: any = this.factories.find(
            (x: any) => {
                return x.componentType.name == routeName;
            }
        );
        return factory;
    }
}
