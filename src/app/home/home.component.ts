import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
//import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber, Subject, Subscription, interval } from 'rxjs';

import { HomeService } from './home.service';
import { WeatherTemperature, RealtimeData, WeatherStation } from './home';
import { ClimateService } from '../climate/climate.service';
import { HighchartsTempratures, HighchartsHumidities } from '../climate/climate'

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeService, ClimateService]
})
export class HomeComponent implements OnInit, AfterContentInit, OnDestroy {
  public timeNow: Observable<string>;
  //public RealtimeData: Observable<WeatherTemperature>;
  public APIRealtimeDate: RealtimeData;
  //public RealtimeDate: string;
  //public RealtimeTemp: string;
  //public DataFromAPI: WeatherTemperature;
  public updata: RealtimeData;

  //Highchart 
  public RealtimeTempGauge: any;
  public RealtimeRHGauge: any;
  @ViewChild('RealtimeTempGauge') public RealtimeTempGaugeEle: ElementRef;
  @ViewChild('RealtimeRHGauge') public RealtimeRHGaugeEle: ElementRef;

  //氣象站台清單、已選取之站台  
  public stations: WeatherStation[];
  public selectedStations: WeatherStation = new WeatherStation();

  private $UpdateRealtime:Subscription;

  constructor(private homeREST: HomeService, private StationREST: ClimateService) {
    // 抓Station Selector選項    
    this.StationREST.getSelectItem()
      .subscribe(
        (result: WeatherStation[]) => {
          this.stations = result;
          //預設初始選項為第一個選項
          this.selectedStations = result[0];
          //得到station id後，馬上初始化即時資料
          this.RefreshRealtimeData(this.selectedStations.stationId);
        },
        error => console.error(error)
      );
  }

  ngOnInit() {
    var options = {
      //year: "numeric", month: "short", day: "numeric",
      hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
      //weekday: "short",
    };
    //1.直接設定param類型為Observable
    this.timeNow = new Observable<string>((observer: Subscriber<string>) => {
      setInterval(() => observer.next(
        //反應速度差不多
        new Date().toLocaleTimeString('zh-TW', options)
      ), 1000);
    });

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
    // //2. 用Observable介面包裝，畫面會閃動~，反應速度差不多
    //     this.RealtimeData = data;
    // //3. 分開給兩個參數，反應速度差不多
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

    //每隔10秒刷新realtime溫溼度資料
    //如果失敗便停止訂閱此監聽
    //rxjs 5->6, interval直接繼承observable,不在是observable底下的方法
    this.$UpdateRealtime = interval(10000)
      .subscribe(() => {
          this.RefreshRealtimeData(this.selectedStations.stationId)
            // .then((val) => {
            //   //刷新完，然後要跑甚麼呢??我再想想唷...            
            // })
            // .catch((val) => {
            //   console.log('Refresh realtime data failure!');
            //   this.$UpdateRealtime.unsubscribe();
            // });            
        },
        (error) => {
          console.log(error);
        },
        () => { console.log('每隔10秒刷新realtime溫溼度資料 complete!'); }
      );
  }

  ngAfterContentInit() {
    // this.updata = {
    //   StationId: 1,
    //   RecTemp: 33,
    //   RecRH: 22
    // };

    // this.homeREST.updateRealtime(this.updata)
    //   .subscribe(
    //     // val => {
    //     //   console.log("hi budy")
    //     //   console.log(val)
    //     //   this.updata=undefined;

    //     //   console.log("PUT call successful value returned in body",
    //     //     val);
    //     // },
    //     // response => {
    //     //   console.log("PUT call in error", response);
    //     // },
    //     // () => {
    //     //   console.log("The PUT observable is now completed.");
    //     // }
    //   );    
    //設定Highstock屬性
    const optionsTemp: Highcharts.Options = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: 'Realtime Temperature'
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
      },
      // the value axis
      yAxis: {
        min: -10,
        max: 50,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 1,
        tickPosition: 'inside',
        tickLength: 15,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto'
        },
        title: {
          text: '°C',
          x: 0,
          y: 180,
          style: {
            fontSize: '20px'
          }
        },
        plotBands: [{
          from: -10,
          to: 15,
          color: '#1E90FF' // blue
        }, {
          from: 15,
          to: 30,
          color: '#55BF3B' // green
        }, {
          from: 30,
          to: 50,
          color: '#DF5353' // red
        }]
      },
      series: [{
        name: 'Temperature',
        data: [],
        dataLabels: {
          formatter:
            function () {
              var temp = this.y;
              return '<span style="color:#339;font-size: 16px;">' + temp + ' °C</span><br/>';
            }
        },
        tooltip: {
          valueSuffix: ' °C'
        }
      }]
    };
    const optionsRH: Highcharts.Options = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: 'Realtime Humidity'
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
      },
      // the value axis
      yAxis: {
        min: 0,
        max: 100,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 1,
        tickPosition: 'inside',
        tickLength: 15,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto'
        },
        title: {
          text: '%',
          x: 0,
          y: 180,
          style: {
            fontSize: '20px'
          }
        },
        plotBands: [{
          from: 0,
          to: 40,
          color: '#1E90FF' // blue
        }, {
          from: 40,
          to: 70,
          color: '#55BF3B' // green
        }, {
          from: 70,
          to: 100,
          color: '#DF5353' // red
        }]
      },
      series: [{
        name: 'RH',
        data: [],
        dataLabels: {
          formatter:
            function () {
              var RH = this.y;
              return '<span style="color:#339;font-size: 16px;">' + RH + ' %</span><br/>';
            }
        },
        tooltip: {
          valueSuffix: ' %'
        }
      }]
    };
    //將基本參數代入，初始化Highchart畫面格式    
    this.RealtimeTempGauge = Highcharts.chart(this.RealtimeTempGaugeEle.nativeElement, optionsTemp);
    this.RealtimeRHGauge = Highcharts.chart(this.RealtimeRHGaugeEle.nativeElement, optionsRH);

  }

  ngOnDestroy(){
    console.log('ngOnDestroy');
    this.$UpdateRealtime.unsubscribe();
  }

  onSelect(StationId: number) {
    for (var i = 0; i < this.stations.length; i++) {
      if (this.stations[i].stationId == StationId) {
        this.selectedStations = this.stations[i];
      }
    }
    //切換後馬上初始化即時資料，不等observer慢慢跑timeinterval
    this.RefreshRealtimeData(this.selectedStations.stationId);
  }

  public async RefreshRealtimeData(StationId: number) {
    //Asynchronous execution is pushed out of the synchronous flow. 
    //That is, the asynchronous code will never execute while the synchronous code stack is executing. 
    //https://stackoverflow.com/questions/23667086/why-is-my-variable-unaltered-after-i-modify-it-inside-of-a-function-asynchron

    //置入資料至溫度的Highchart
    await this.homeREST.getRealtimeData(StationId)
      .subscribe(
        (data: RealtimeData) => {
          this.APIRealtimeDate = data;
          this.UpdateHighchart(this.RealtimeTempGauge, data, 'Temp');
          this.UpdateHighchart(this.RealtimeRHGauge, data, 'RH');
        },
        (error) => {
          console.log(error);
          //錯誤便停止定時訂閱UpdateRealtime
          this.$UpdateRealtime.unsubscribe();          
        },
        () => {
          //console.log('RefreshRealtimeData!')
        }
      );    
  }

  ///mode is Temp(溫度) or RH(濕度)
  private UpdateHighchart(chart: Highcharts.ChartObject, UpdateData: RealtimeData, mode: string) {
    let Data: any = [];

    if (mode == 'Temp') {
      Data.push([
        UpdateData.recTemp
      ]);
    }
    else if (mode == 'RH') {
      Data.push([
        UpdateData.recRH
      ]);
    }
    chart.series[0].update({
      data: Data
    }, true);
  }
}