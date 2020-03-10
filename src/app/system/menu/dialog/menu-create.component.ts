import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Menu } from '../../../../interface/system_auth/menu';

@Component({
    moduleId: module.id,
    selector: 'menu-create-unit',
    templateUrl: 'menu-create.component.html',
    styleUrls: ['../menu.component.css']
})

export class MenuCreateComponent {
    // we will pass in address, named as group when Input, from MenuComponent
    @Input('group') public menuForm: FormGroup;
    @Input('menuList') public menuList: Menu[];

    constructor() {}
}
