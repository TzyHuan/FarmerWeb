import { Component, OnInit, Input } from '@angular/core';
import { WindowService, SideNavState } from '../window.service'
import { SharedService } from '../../../shared-service';

@Component({
    selector: 'window-dragAction',
    templateUrl: './dragAction.component.html',
    styleUrls: ['./dragAction.component.css'],
    //providers: []
})

export class DragActionComponent implements OnInit{ 

    @Input('windowTitle') Title:string;
    sideSwitchButtonList: SwitchButton[] = [
        { name: '供應商/客戶', value: 1 },
        { name: 'Test', value: 2 }
    ];

    constructor(public _WindowService:WindowService, public _SharedService:SharedService) {      

    } 

    ngOnInit(){
        
    }

    onToggle(event:any, id: number) {        

        console.log("click:" + id);        
        this._WindowService.emitSideChange(id);       
       
    }
   
}

export class SwitchButton {
    name: string;
    value: number;
}