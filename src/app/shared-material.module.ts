import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
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
import { MatCheckboxModule } from '@angular/material/checkbox'

//Dialogs' Component inside Component
import { DialogMenuDeleteComponent } from './dialog/dialog-menu-delete.component'
import { DialogMenuUpdateComponent } from './dialog/dialog-menu-update.component';
import { DialogMenuCreateComponent } from './dialog/dialog-menu-create.component';
import { DialogCharacterCreateComponent } from './dialog/dialog-character-create.component';
import { DialogCharacterDeleteComponent } from './dialog/dialog-character-delete.component';

//Child components in dialogs
import { MenuCreateComponent } from './dialog/menu-create.component';
import { CharacterCreateComponent } from './dialog/character-create.component';

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
    MatCheckboxModule
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
  CharacterCreateComponent
]