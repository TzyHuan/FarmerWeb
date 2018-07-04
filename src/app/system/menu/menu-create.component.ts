import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Menu } from './menu';
import { MenuService } from './menu.service';
@Component({
    moduleId: module.id,
    selector: 'MenuCreateUnit',
    templateUrl: 'menu-create.component.html',
    styleUrls: ['./menu.component.css']
})

export class MenuCreateComponent {
    // we will pass in address, named as group when Input, from MenuComponent
    @Input('Group') public MenuForm: FormGroup;
    @Input('MenuList') public MenuList: Menu[];

    constructor() {}
}