import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SystemComponent } from './system.component';
import { SharedService, CheckService } from '../shared-service';
import { VmMenu } from '../../interface/system_auth/vm_menu';

const routes: Routes = [{
    path: '',
    component: SystemComponent,
    children: [],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class SystemRoutingModule {
    private renderRoutingUnsubscribe: Subject<any> = new Subject();

    constructor(
        private router: Router,
        private sharedService: SharedService,
        private resolver: ComponentFactoryResolver,
    ) {
        this.sharedService.childRoutesEmitted$.pipe(
            takeUntil(this.renderRoutingUnsubscribe),
        ).subscribe(([parentPath, childList]: [string, VmMenu[]]) => {
            CheckService.checkLazyRouter(
                parentPath, childList, this.resolver, this.router,
                'system', this.renderRoutingUnsubscribe
            );
        }, (error) => {
            console.error(error);
        });
    }
}
