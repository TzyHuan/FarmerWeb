import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RoleGroup } from '../system/character/character';

@Component({
    moduleId: module.id,
    selector: 'CharacterCreateUnit',
    templateUrl: 'chatacter-create.component.html',
    styleUrls: ['../system/character/character.component.css']
})

export class CharacterCreateComponent {
    // we will pass in address, named as group when Input, from MenuComponent
    @Input('Group') public RoleForm: FormGroup;
    @Input('RoleList') public RoleList: RoleGroup[];

    constructor() {}
}