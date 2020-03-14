import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponet } from './map.component';

const routes: Routes = [{
    path: '',
    component: MapComponet,
    children: [],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class MapRoutingModule {
    constructor() { }
}
