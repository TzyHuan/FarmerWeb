import { BrowserModule } from '@angular/platform-browser'; //沒加這列無法使用HttpClientModule
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './navmenu/navmenu.component';

import { AppRoutingModule, routingComponents } from './app-routing.module';

const appRoute: Routes = [
]

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),    
    AppRoutingModule
  ],
  providers: [],
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
