import { BrowserModule } from '@angular/platform-browser'; //沒加這列無法使用HttpClientModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularDraggableModule } from 'angular2-draggable';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './navmenu/navmenu.component';

import { AppRoutingModule, AppRoutingComponents } from './app-routing.module';

import { AuthInterceptor } from '../interceptor/auth.interceptor';
import { SharedMaterialModule } from './shared-material.module';
import { SystemComponents } from './system/system.module';
import { MapComponents } from './map/map.module';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    AppRoutingComponents,
  ],
  imports: [
    BrowserModule,            //must put first
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,         //component 路徑樹狀結構
    BrowserAnimationsModule,  //angular material animation
    SharedMaterialModule,     //used material
    AngularDraggableModule    //directive of ngDraggable/ngResizable to make the DOM element draggable
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,  //過濾封包
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
  //動態加入components，需要在 @NgModule中加入entryComponents把動態components放入
  //這裡通常是用來宣告不通過Route動態加入到DOM中的元件，指定在這裡的元件將會在這個模組定義的時候進行編譯
  //Angular會建立ComponentFactory然後存在ComponentFactoryResolver
  //Angular 官網說明：
  // An entry component is any component that Angular loads imperatively, 
  // (which means you’re not referencing it in the template), by type. 
  // You specify an entry component by bootstrapping it in an NgModule,
  // or including it in a routing definition.
  entryComponents: [
    AppRoutingComponents,
    MapComponents,
    SystemComponents[0],
  ]
})

export class AppModule { }
