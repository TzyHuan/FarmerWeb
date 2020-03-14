import { MapComponet } from './map.component'

import { DialogSupplyChainCreateComponent } from './dialog/dialog-supplychain-create.component';
import { DialogSupplyChainDeleteComponent } from './dialog/dialog-supplychain-delete.component';
import { WindowComponent } from './windows/window.component';

/** Child components in dialogs */
import { CustomerCreateComponent } from './dialog/customer-create.component';
import { VendorCreateComponent } from './dialog/vendor-create.component';

/** Child components in Sidenav */
import { DrawerSupplyChainComponent } from './drawer/drawer-supplychain.component';

/** Child component in windows */
import { DragActionComponent } from './windows/dragAction/dragAction.component';
import { DragChartComponent } from './windows/dragChart/dragChart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedMaterialModule } from '../shared-material.module';
import { AngularDraggableModule } from 'angular2-draggable';
import { MapRoutingModule } from './map-routing.module';

// 這邊宣告所有Material的Components
export const MapComponents = [

    //地圖-供應商
    MapComponet,

    /** Dialogs */
    DialogSupplyChainCreateComponent,
    DialogSupplyChainDeleteComponent,
    /** Child components in dialogs */    
    VendorCreateComponent,
    CustomerCreateComponent,
    /** Child component in windows */
    DragActionComponent,
    DragChartComponent,
    
    /** Others */
    DrawerSupplyChainComponent,
    WindowComponent,    
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        // directive of ngDraggable/ngResizable to make the DOM element draggable
        AngularDraggableModule,
        MapRoutingModule,
    ],
    declarations: MapComponents,
    providers:[
    ],
    entryComponents: [
        // 加在這裡root NgModule吃不到，只有此NgModule讀得到，所以兩邊都要加
        // 未來版本可能會改進 https://github.com/angular/angular/issues/14324#issuecomment-481898762
        MapComponents,
    ],
})

export class MapModule { }