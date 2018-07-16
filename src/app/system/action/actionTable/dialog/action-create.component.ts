import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action } from '../../Action';

@Component({
    moduleId: module.id,
    selector: 'ActionCreateUnit',
    templateUrl: 'action-create.component.html',
    styleUrls: ['../../action.component.css']
})

export class ActionCreateComponent {
    // we will pass in address, named as group when Input, from ActionComponent
    @Input('Group') public ActionForm: FormGroup;
    //@Input('ActionList') public ActionList: Action[];
    public MethodList: string[] = ['GET', 'POST', 'PUT', 'DELETE'];

    constructor() {}

    compareObjects(o1: any, o2: any): boolean {
        if (o1 == '') o1 = 'GET';
        return o1 == o2;
      }
}