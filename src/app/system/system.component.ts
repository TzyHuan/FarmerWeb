import { Component } from '@angular/core';
import { SharedService } from '../shared-service';
import { VmMenu } from '../../interface/system_auth/vm_menu';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css'],
  //providers: [ SharedService ] //已在app.module 
})

export class SystemComponent {

  menuList: VmMenu[];

  constructor(private sharedService: SharedService) {
    this.sharedService.childRoutesEmitted$.subscribe((menus: VmMenu[]) => {
      this.menuList = menus;     
    });
  }
}
