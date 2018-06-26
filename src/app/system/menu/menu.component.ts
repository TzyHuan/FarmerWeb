import { Component, OnInit } from '@angular/core';
import { Menu } from './menu';
import { MenuService } from './menu.service'
import { error } from 'protractor';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MenuService]
})
export class MenuComponent implements OnInit {

  public MenuList: Menu[];

  constructor(private MenuREST: MenuService) {
    this.MenuREST.GetMenu().subscribe(
      (result: Menu[]) => {
        console.log(result);
        this.MenuList = result;
      },
      error => {
        console.log(error);
      }
    )
  }

  ngOnInit() {
  }

}
