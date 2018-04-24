import { BrowserModule } from '@angular/platform-browser'; //沒加這列無法使用HttpClientModule
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './navmenu/navmenu.component';
import { ClimateComponent} from './climate/climate.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ClimateComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },   
      { path: 'Climate', component: ClimateComponent},  
      { path: '**', component: HomeComponent }
  ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
