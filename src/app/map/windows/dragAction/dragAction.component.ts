import { Component, Input } from '@angular/core';
import { WindowService } from '../window.service'

@Component({
    selector: 'window-dragAction',
    templateUrl: './dragAction.component.html',
    styleUrls: ['./dragAction.component.css'],
})

export class DragActionComponent {

    @Input('windowTitle') title: string;
    sideSwitchButtonList: SwitchButton[] = [
        { name: '供應商/客戶', value: 1 },
        { name: 'Test', value: 2 }
    ];

    constructor(public windowService: WindowService) {
    }

    onToggle(event: any, id: number) {
        console.log("click:" + id);
        this.windowService.emitSideChange(id);
    }
}

export class SwitchButton {
    name: string;
    value: number;
}