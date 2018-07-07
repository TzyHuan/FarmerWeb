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

//Component inside Component
import { DialogMenuDeleteComponent } from './dialog/dialog-menu-delete.component'
import { DialogMenuUpdateComponent } from './dialog/dialog-menu-update.component';
import { DialogMenuCreateComponent } from './dialog/dialog-menu-create.component';

//子選單
import { MenuCreateComponent } from './dialog/menu-create.component';

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
    MatToolbarModule
  ]
})

export class SharedMaterialModule { }

// 這邊宣告所有Material的Components
export const MatComponents = [  
  //系統管理-選單權限
  DialogMenuDeleteComponent,
  DialogMenuUpdateComponent,
  DialogMenuCreateComponent,
  MenuCreateComponent
]