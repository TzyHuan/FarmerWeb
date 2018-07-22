import { BrowserModule } from '@angular/platform-browser'; //沒加這列無法使用HttpClientModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './navmenu/navmenu.component';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { UserComponent } from './user/user.component';

import { UserService } from './user/shared/user.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { SharedService } from './shared-service';
import { SharedMaterialModule, MatComponents } from './shared-material.module'

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    routingComponents,  
    UserComponent,
    MatComponents
  ],
  imports: [
    BrowserModule,//must put first    
    HttpClientModule,
    FormsModule,    
    ReactiveFormsModule,
    NgbModule.forRoot(),    
    AppRoutingModule,
    BrowserAnimationsModule, //angular material animation
    SharedMaterialModule //used material
  ],
  providers: [    
    SharedService,
    UserService,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
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
  entryComponents:[   
    routingComponents,
    MatComponents
  ]
})

export class AppModule { }
