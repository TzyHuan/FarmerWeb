import { Component, OnInit, AfterContentInit } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

import { HomeService } from './home.service';
import { WeatherTemperature, RealtimeData } from './home';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit, AfterContentInit {
  public timeNow: Observable<string>;
  public RealtimeData: Observable<WeatherTemperature>;
  public RealtimeDate: string;
  public RealtimeTemp: string;
  public DataFromAPI: WeatherTemperature;
  public updata: RealtimeData;

  constructor(private homeREST: HomeService) { }

  ngOnInit() {
    
    // var options = {
    //   weekday: "short", year: "numeric", month: "short",
    //   day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
    //   hour12: false
    // };
    // //1.直接設定param類型為Observable
    // this.timeNow = new Observable<string>((observer: Subscriber<string>) => {
    //   setInterval(() => observer.next(
    //     //反應速度差不多
    //     new Date().toLocaleTimeString('zh-TW', options)
    //   ), 1000);
    // });

    // //每隔一秒監聽呼叫API一次
    // var observable = Observable.create((observer) => {
    //   var id = setInterval(() => {
    //     //do somethings here
    //     observer.next(this.homeREST.getRealtimeData());
    //   }, 1000);
    //   setTimeout(() => {
    //     clearInterval(id);
    //     observer.complete();
    //   }, 5000);
    // });
    // //訂閱監聽
    // observable.subscribe(
    //   (data: Observable<WeatherTemperature>) => {
    //     console.log('data received');
    //     //2. 用Observable介面包裝，畫面會閃動~，反應速度差不多
    //     this.RealtimeData = data;
    //     //3. 分開給兩個參數，反應速度差不多
    //     data.subscribe(x => this.RealtimeDate = x.dateFormatted);
    //     data.subscribe(y => this.RealtimeTemp = y.temperatureC);
    //   },
    //   error => {
    //     console.log('幹!!!');
    //   },
    //   complete => {
    //     console.log('completed!!!fuck nsb');
    //   });

    // //4. 直接監聽API，非同步反應速度最快！比上便都快，不然就是比上面都慢Orz
    // Observable.interval(1000).subscribe(
    //   values => {
    //     this.homeREST.getRealtimeData()
    //       .subscribe(
    //         data => { this.DataFromAPI = data }
    //       )
    //   },
    //   (error) => { console.log(error); }
    // );
    
  }

  ngAfterContentInit() {
    this.updata = {
      StationId: 3,
      RecTemp: 33,
      RecRH: 22
    };

    this.homeREST.updateRealtime(this.updata)
      .subscribe(
        // val => {
        //   console.log("hi budy")
        //   console.log(val)
        //   this.updata=undefined;

        //   console.log("PUT call successful value returned in body",
        //     val);
        // },
        // response => {
        //   console.log("PUT call in error", response);
        // },
        // () => {
        //   console.log("The PUT observable is now completed.");
        // }
      );
  }
}
