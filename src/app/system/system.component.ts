import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared-service';
//----ViewModel----//
import { vmNavMenu } from '../navmenu/navmenu';


@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
  //providers: [ SharedService ] //已在app.module 
})
export class SystemComponent implements OnInit {

  public MenuList: vmNavMenu[];

  constructor(private _sharedService: SharedService) {
    _sharedService.ChildRoutesEmitted$.subscribe((Menus: vmNavMenu[]) => {
      this.MenuList = Menus;
      console.log(this.MenuList);
    });
  }

  ngOnInit() {
  }

}
