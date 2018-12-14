import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { WindowService } from './window.service';

@Component({
    selector: 'window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.css'],
})

export class WindowComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input('Title') Title: string;
    @Input('Index') Index: number;
    @Input('Bound') LimitedBound: HTMLDivElement;
    @ViewChild('dropTarget') dropTarget: ElementRef;

    constructor(public _WindowService: WindowService) {


    }

    ngOnInit() {
        console.log("open:" + this.Title);
    }

    ngAfterViewInit() {
        if (this.dropTarget != undefined && this.dropTarget != null) {
            

            let dropTarget = this.dropTarget.nativeElement;
            dropTarget.addEventListener('drop', dropped);
            dropTarget.addEventListener('dragenter', cancelDefault);
            dropTarget.addEventListener('dragover', cancelDefault);
            console.log(dropTarget);
    
            function dropped(e) {
                console.log('dropped')
                cancelDefault(e)
                //let id = e.dataTransfer.getData('text/plain')
                //e.target.appendChild(document.querySelector('#' + id))
            }
    
            function cancelDefault(e) {
                e.preventDefault()
                e.stopPropagation()
                return false
            }
        }       
    }

    ngOnDestroy() {
        console.log("close:" + this.Title);
    }

    clickClose() {
        this._WindowService.emitWindowClose(this.Index);
    }

}