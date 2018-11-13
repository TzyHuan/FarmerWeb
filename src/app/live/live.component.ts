import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscriber, Subject, Subscription, interval } from 'rxjs';

import videojs from 'video.js';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.css'],
    providers: []
})

export class LiveComponent implements OnInit, OnDestroy {

    options: any = {
        width: 848,
        height: 480,       
        controls: true,
        preload: "auto", //預載：string；'auto'|'true'|'metadata'|'none'
    };

    player:any;

    constructor() {

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
}