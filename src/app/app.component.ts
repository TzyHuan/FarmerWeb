import { Component } from '@angular/core';
import { SharedService } from './shared-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ SharedService ]
})
export class AppComponent {
  constructor(private _sharedService:SharedService) {
  };

  /** 點選router-outlet時，若此router-outlet還有子選，
   * 其子選單的[routerLink]一併在此call api查詢完，
   * 再利用sharedService傳給router-outlet 
  */
  public onRouterOutletActivate(event: Object) {
    this._sharedService.emitChildRoutes(event);   
  }

}