import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscriber, Subject, Subscription, interval } from 'rxjs';
import { GpioService } from '../../api/raspberry/RaspGpio.service';

import videojs from 'video.js';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.css'],
    providers: [GpioService]
})

export class LiveComponent implements OnInit, OnDestroy {

    options: any = {
        width: 848,
        height: 480,
        controls: true,
        preload: "auto", //預載：string；'auto'|'true'|'metadata'|'none'
    };

    player: any;

    constructor(private _GpioService: GpioService) {

    }

    ngOnInit() {

        this.player = videojs('vid1', this.options, function onPlayerReady() {
            videojs.log('Your player is ready!');

            // In this context, `this` is the player that was created by Video.js.
            //this.play();

            // How about an event listener?
            this.on('ended', function () {
                videojs.log('Awww...over so soon?!');
            });
        });
    }

    ngOnDestroy() {
        //離開時釋放撥放器
        this.player.dispose();
    }

    /**
     * gpio off = 1, 3.3v
     * gpio on  = 0, 0v
     * @param pin BCM接腳編號
     * @param event on: true, off: false
     */
    SetGpio(pin: number, event: boolean) {

        let onoff = Number(!event);
        this._GpioService.SetGpio(pin, onoff).subscribe(x => {
            console.log(x);
        });
    }

    UnexportGpio(pin: number, event: string) {

        this._GpioService.SetGpio(pin, event).subscribe(x => {
            console.log(x);
        });
    }

    ReadGpioStatus(pin: number, event: string) {

        this._GpioService.ReadGpioStatus(pin).subscribe(x => {
            console.log(x);
        })
    }

    ReadAllGpioStatus(pins: any[]) {
        this._GpioService.ReadAllGpioStatus(pins).subscribe(x => {
            console.log(x);
        })
    }
}

function AllowDrop(event){
    event.preventDefault();
}
function Drag(event){
    event.dataTransfer.setData("text",event.currentTarget.id);
}
function Drop(event){
    event.preventDefault();
    var data=event.dataTransfer.getData("text");
    event.currentTarget.appendChild(document.getElementById(data));
}