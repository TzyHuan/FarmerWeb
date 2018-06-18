import { BrowserModule } from '@angular/platform-browser'; //沒加這列無法使用HttpClientModule
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './navmenu/navmenu.component';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';

import { UserService } from './user/shared/user.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MenuService } from './navmenu/navmenu.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    routingComponents,
    UserComponent,
    SignInComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot(),    
    AppRoutingModule
  ],
  providers: [    
    UserService,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    }
  ],
  bootstrap: [AppComponent],
  //動態加入components，需要在 @NgModule中加入entryComponents把動態components放入
  //Angular 官網說明：
  // An entry component is any component that Angular loads imperatively, 
  // (which means you’re not referencing it in the template), by type. 
  // You specify an entry component by bootstrapping it in an NgModule,
  // or including it in a routing definition.
  entryComponents:[routingComponents]
})

export class AppModule { }
