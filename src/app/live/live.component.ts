import { Component, OnInit, OnDestroy } from '@angular/core';
import { GpioService } from '../../api/raspberry/rasp_gpio.service';

import videojs from 'video.js';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.css'],
    providers: [GpioService]
})

export class LiveComponent implements OnInit, OnDestroy {
    gpioCheckedObject: GpioCheckedObject = new GpioCheckedObject();
    player: any;
    options: any = {
        html5: {
            hls: {
                overrideNative: !videojs.browser.IS_SAFARI
            }
        },
        width: 848,
        height: 480,
        controls: true,
        preload: 'auto', // 預載：string；'auto'|'true'|'metadata'|'none'
    };

    constructor(private gpioService: GpioService) {
    }

    ngOnInit() {
        this.initializeAllGpioStatus();
        this.player = videojs('vid1', this.options, function onPlayerReady() {
            videojs.log('Your player is ready!');

            // In this context, `this` is the player that was created by Video.js.
            // this.play();

            // How about an event listener?
            this.on('ended', function () {
                videojs.log('Awww...over so soon?!');
            });
        });
        this.player.src(environment.videoUrl);
    }

    ngOnDestroy() {
        // 離開時釋放撥放器
        this.player.dispose();
    }

    changeIntensityOfLed(value: number) {
        this.gpioService.putPwm(12, 500, value).subscribe(x => {
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
        const onoff = Number(event);
        this.gpioService.putGpio(pin, onoff).subscribe(x => {
            console.log(x);
        });
    }

    initializeAllGpioStatus() {
        this.gpioService.getAllGpioStatus().subscribe(gpioStatus => {
            gpioStatus.forEach(x => {
                switch(x.pin._gpio){
                    case 20:
                        this.gpioCheckedObject.isCheckedFan = Boolean(x.value);
                        console.log(20, this.gpioCheckedObject.isCheckedFan);
                        break;
                    case 21:
                        this.gpioCheckedObject.isCheckedLed = Boolean(x.value);
                        console.log(21, this.gpioCheckedObject.isCheckedLed);
                        break;
                    default:
                        break;
                }
            });
            
        });
    }
}

class GpioCheckedObject{
    isCheckedLed: boolean = false;
    isCheckedFan: boolean = false;
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
