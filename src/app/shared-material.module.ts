import { NgModule } from '@angular/core';
import { MatButtonModule, MatNativeDateModule } from '@angular/material'; //MatNativeDateModule is for datepicker
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

/** Dialogs' Component inside Component */
//Menu
import { DialogMenuDeleteComponent } from './system/menu/dialog/dialog-menu-delete.component';
import { DialogMenuUpdateComponent } from './system/menu/dialog/dialog-menu-update.component';
import { DialogMenuCreateComponent } from './system/menu/dialog/dialog-menu-create.component';
//Character
import { DialogCharacterCreateComponent } from './system/character/dialog/dialog-character-create.component';
import { DialogCharacterDeleteComponent } from './system/character/dialog/dialog-character-delete.component';
import { DialogCharacterUpdateComponent } from './system/character/dialog/dialog-character-update.component';
import { DialogImenuRoleComponent } from './system/character/dialog/dialog-ImenuRole.component';
import { DialogIactionRoleComponent } from './system/character/dialog/dialog-IactionRole.component';
//Controller
import { DialogCtrlCreateComponent } from './system/action/ctrlTable/dialog/dialog-ctrl-create.component';
import { DialogCtrlDeleteComponent } from './system/action/ctrlTable/dialog/dialog-ctrl-delete.component';
import { DialogCtrlUpdateComponent } from './system/action/ctrlTable/dialog/dialog-ctrl-update.component';
//Actions
import { DialogActionCreateComponent } from './system/action/actionTable/dialog/dialog-action-create.component';
import { DialogActionDeleteComponent } from './system/action/actionTable/dialog/dialog-action-delete.component';
import { DialogActionUpdateComponent } from './system/action/actionTable/dialog/dialog-action-update.component';
//Members
import { DialogMemberCreateComponent } from './system/member/dialog/dialog-member-create.component';
import { DialogMemberUpdateComponent } from './system/member/dialog/dialog-member-update.component';
import { DialogMemberDeleteComponent } from './system/member/dialog/dialog-member-delete.component';
import { DialogImemRoleComponent } from './system/member/dialog/dialog-ImemRole.component';
//Map
import { DialogSupplyChainCreateComponent } from './map/dialog/dialog-supplychain-create.component';
import { DialogSupplyChainDeleteComponent } from './map/dialog/dialog-supplychain-delete.component';

/** Child components in dialogs */
//Menus
import { MenuCreateComponent } from './system/menu/dialog/menu-create.component';
//Characters
import { CharacterCreateComponent } from './system/character/dialog/character-create.component';
//Actions
import { ActionCreateComponent } from './system/action/actionTable/dialog/action-create.component';
//Map
import { CustomerCreateComponent } from './map/dialog/customer-create.component';
import { VendorCreateComponent } from './map/dialog/vendor-create.component';

/** Child components in Tab */
//Actions
import { ActionTableComponent } from './system/action/actionTable/actionTable.component';
import { CtrlTableComponent } from './system/action/ctrlTable/ctrlTable.component';

/** Child components in Sidenav */
import { DrawerSupplyChainComponent } from './map/drawer/drawer-supplychain.component';

@NgModule({
  //imports: [MatButtonModule], // import內用
  exports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatTreeModule,
    CdkTreeModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatRadioModule,
    MatDividerModule,
    MatCardModule,
    MatExpansionModule
  ]
})

export class SharedMaterialModule { }

// 這邊宣告所有Material的Components
export const MatComponents = [
  //系統管理-選單權限
  DialogMenuDeleteComponent,
  DialogMenuUpdateComponent,
  DialogMenuCreateComponent,
  MenuCreateComponent,

  //系統管理-角色權限
  DialogCharacterCreateComponent,
  DialogCharacterDeleteComponent,
  DialogCharacterUpdateComponent,
  CharacterCreateComponent,
  //系統管理-角色權限-角色選單
  DialogImenuRoleComponent,
  DialogIactionRoleComponent,

  //系統管理-控制動作
  ActionTableComponent,
  CtrlTableComponent,
  DialogCtrlCreateComponent,
  DialogCtrlDeleteComponent,
  DialogCtrlUpdateComponent,
  DialogActionCreateComponent,
  DialogActionDeleteComponent,
  DialogActionUpdateComponent,
  ActionCreateComponent,

  //系統館理-帳戶管理
  DialogMemberCreateComponent,
  DialogMemberUpdateComponent,
  DialogMemberDeleteComponent,
  DialogImemRoleComponent,

  //地圖-供應商
  DialogSupplyChainCreateComponent,
  VendorCreateComponent,
  CustomerCreateComponent,
  DialogSupplyChainDeleteComponent,
  DrawerSupplyChainComponent,
]