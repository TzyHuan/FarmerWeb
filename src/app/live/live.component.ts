import { Component, OnInit, OnDestroy } from '@angular/core';
import { GpioService } from '../../api/raspberry/rasp_gpio.service';

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

    constructor(private gpioService: GpioService) {

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

    changeIntensityOfLed(value: number) {
        this.gpioService.putPwm(12, 500, value).subscribe(x=>{
            console.log(x);
        });
    }

    /**
     * gpio off = 1, 3.3v
     * gpio on  = 0, 0v
     * @param pin BCM接腳編號
     * @param event on: true, off: false
     */
    setGpio(pin: number, event: boolean) {
        let onoff = Number(!event);
        this.gpioService.putGpio(pin, onoff).subscribe(x => {
            console.log(x);
        });
    }

    readGpioStatus(pin: number, event: string) {
        this.gpioService.getGpioStatus(pin).subscribe(x => {
            console.log(x);
        });
    }

    readAllGpioStatus(pins: any[]) {
        this.gpioService.getAllGpioStatus().subscribe(x => {
            console.log(x);
        });
    }
}

// function allowDrop(event){
//     event.preventDefault();
// }
// function drag(event){
//     event.dataTransfer.setData("text",event.currentTarget.id);
// }
// function drop(event){
//     event.preventDefault();
//     var data=event.dataTransfer.getData("text");
//     event.currentTarget.appendChild(document.getElementById(data));
// }