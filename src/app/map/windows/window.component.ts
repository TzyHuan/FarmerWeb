import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { WindowService } from './window.service';

@Component({
    selector: 'window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.css'],
})

export class WindowComponent implements OnInit, OnDestroy {

    @Input('Title') Title: string;
    @Input('Index') Index: number;
    @Input('Bound') LimitedBound: HTMLDivElement;

    constructor(public _WindowService: WindowService) {

    }

    ngOnInit() {
        console.log("open:" + this.Title);
    }

    ngOnDestroy() {
        console.log("close:" + this.Title);
    }

    clickClose() {
        this._WindowService.emitWindowClose(this.Index);
    }

}