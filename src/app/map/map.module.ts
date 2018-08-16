import { MapComponet } from './map.component'

import { DialogSupplyChainCreateComponent } from './dialog/dialog-supplychain-create.component';
import { DialogSupplyChainDeleteComponent } from './dialog/dialog-supplychain-delete.component';
import { WindowComponent } from './windows/window.component';

/** Child components in dialogs */
import { CustomerCreateComponent } from './dialog/customer-create.component';
import { VendorCreateComponent } from './dialog/vendor-create.component';

/** Child components in Sidenav */
import { DrawerSupplyChainComponent } from './drawer/drawer-supplychain.component';

export class MapModule { }

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
    
    /** Others */
    DrawerSupplyChainComponent,
    WindowComponent
    
]