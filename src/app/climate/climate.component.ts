import { Component, OnInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { HttpParams } from '@angular/common/http'

import { ClimateService } from './climate.service'
import { WeatherStation, HighchartsTempratures, HighchartsHumidities } from './climate'

/** If there isn't a declaration file, the TypeScript compiler 
 * doesn't know if the module exists, so you need to use require 
 * instead which lacks the compilation checking.*/
import Highcharts from 'highcharts/highstock'; 
//import HighchartsMore from 'highcharts/highcharts-more';

/**https://www.highcharts.com/docs/getting-started/install-from-npm
 * 兩種方式都可載入，請看highcharts-more.js最上方的code
 * 其factory定義為返回module的function
 * if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }*/
//1.
//HighchartsMore(Highcharts) 
/** dirty and quick, set tsconfig.app.ts is better */
//declare var require: any; 
//2.
require('highcharts/highcharts-more')(Highcharts);

@Component({
  selector: 'app-climate',
  templateUrl: './climate.component.html',
  styleUrls: ['./climate.component.css'],
  providers: [ClimateService]
})

export class ClimateComponent implements OnInit, AfterContentInit {
  public TemperatureChart: any;
  public HumidityChart: any;
  @ViewChild('TemperatureChart') TemperatureChartEle: ElementRef;
  @ViewChild('HumidityChart') HumidityChartEle: ElementRef;

  //氣象站台選項
  public stations: WeatherStation[];
  public selectedStations: WeatherStation = new WeatherStation();

  constructor(private ClimateREST: ClimateService) {
    // 抓Station Selector選項
    this.ClimateREST.getSelectItem()
      .subscribe(
        result => {
          this.stations = result;
          //預設初始選項為第一個選項
          this.selectedStations = this.stations[0];
        },
        error => console.error(error));


  };

  ngOnInit() {
  };

  ngAfterContentInit() {

    //設定Highstock屬性
    const optionsA: Highcharts.Highstock.Options = {
      chart: {
        //type: 'spline'
        zoomType: 'x'
      },
      title: {
        text: 'Hourly temperatures'
      },
      rangeSelector: {
        buttons: [{
          type: 'day',
          count: 3,
          text: '3d'
        }, {
          type: 'week',
          count: 1,
          text: '1w'
        }, {
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 6,
          text: '6m'
        }, {
          type: 'year',
          count: 1,
          text: '1y'
        }, {
          type: 'all',
          text: 'All'
        }],
        selected: 2
      },
      xAxis: {
        type: 'datetime', //'categories'/*: ['Apples', 'Bananas', 'Oranges']*/
        dateTimeLabelFormats: { // don't display the dummy year
          day: "%b. %e",
          week: "%b. %e",
          month: '%b. %e',
          year: '%Y',
        },
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: 'Temperature(°C)'
        }
      },
      tooltip: {
        headerFormat: '<b>{point.x: %b.%e, %H:%M}</b><br>',
        pointFormat: '<b>{series.name}: {point.y:.2f}°C</b>'
      },
      series: [{
        name: 'Temperature',
        data: []
      }]
      //createSeries(this.TemperatureData)           /*[[0, 2],[1, 5],[4,1]]*/             
    };
    const optionsB: Highcharts.Highstock.Options = {
      chart: {
        //type: 'spline'
        zoomType: 'x'
      },
      title: {
        text: 'Hourly Humidity'
      },
      rangeSelector: {
        buttons: [{
          type: 'day',
          count: 3,
          text: '3d'
        }, {
          type: 'week',
          count: 1,
          text: '1w'
        }, {
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 6,
          text: '6m'
        }, {
          type: 'year',
          count: 1,
          text: '1y'
        }, {
          type: 'all',
          text: 'All'
        }],
        selected: 2
      },
      xAxis: {
        type: 'datetime', //'categories'/*: ['Apples', 'Bananas', 'Oranges']*/
        dateTimeLabelFormats: { // don't display the dummy year
          day: "%b. %e",
          week: "%b. %e",
          month: '%b. %e',
          year: '%Y',
        },
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: 'Relative Humidity(%)'
        }
      },
      tooltip: {
        headerFormat: '<b>{point.x: %b.%e, %H:%M}</b><br>',
        pointFormat: '<b>{series.name}: {point.y:.2f}%</b>'
      },
      series: [{
        name: 'RH',
        data: []
      }]
      //createSeries(this.TemperatureData)           /*[[0, 2],[1, 5],[4,1]]*/             
    };

    //初始化Highstock
    this.TemperatureChart =new Highcharts.stockChart(this.TemperatureChartEle.nativeElement, optionsA);
    this.HumidityChart = new Highcharts.stockChart(this.HumidityChartEle.nativeElement, optionsB);

    //初始查詢條件
    const params = new HttpParams()
    .set('StationId', String(this.selectedStations.stationId))
    .set('SearchNum', "10000");

    //置入資料至溫度的Highstock
    this.ClimateREST.getTemperatures(params)
      .subscribe(
        (result: HighchartsTempratures[]) => {
          console.log('ngAfterContentInit: getTemperatures()');
          this.DrawTempHighcharts(this.TemperatureChart, result);
        }, 
        error => console.error(error)
      );

    //置入資料至溫度的Highstock
    this.ClimateREST.getRelativeHumidities(params)
      .subscribe(
        (result: HighchartsHumidities[]) => {
          console.log('ngAfterContentInit: getRelativeHumidities()');
          
          this.DrawRhHighcharts(this.HumidityChart, result);
        },
        error => console.error(error)
      );

  };

  onSelect(StationId: number) {
    //this.selectedStations;
    for (var i = 0; i < this.stations.length; i++) {
      if (this.stations[i].stationId == StationId) {
        this.selectedStations = this.stations[i];
      }
    }

    const params = new HttpParams()
      .set('StationId', StationId.toString())
      .set('SearchNum', "100000");

    this.ClimateREST.getTemperatures(params)
      .subscribe(
        (result: HighchartsTempratures[]) => {
          console.log('onSelect: getTemperatures()');
          this.DrawTempHighcharts(this.TemperatureChart, result);
        }, 
        error => console.error(error)        
      );

    this.ClimateREST.getRelativeHumidities(params)
      .subscribe(
        (result: HighchartsHumidities[]) => {
          console.log('onSelect: getRelativeHumidities()');
          this.DrawRhHighcharts(this.HumidityChart, result);
        }, error => console.error(error));
  }

  private DrawTempHighcharts(chart: Highcharts.ChartObject, UpdateData: any) {
    let TemperatureData: any = [];
    console.log('DrawHighcharts');
    for (var i = 0; i < UpdateData.length; i++) {
      let TimeTemp: any = UpdateData[i].dateFormatted.split("-");
      TemperatureData.push([
        Date.UTC(TimeTemp[0], TimeTemp[1], TimeTemp[2], TimeTemp[3], TimeTemp[4]),
        UpdateData[i].temperatureC
      ]);
    };

    chart.series[0].update({
      data: TemperatureData
    }, true);
  }

  private DrawRhHighcharts(chart: Highcharts.ChartObject, UpdateData: any) {
    let RelativeHumidityData: any = [];
    console.log('DrawHighcharts');
    for (var i = 0; i < UpdateData.length; i++) {
      let TimeTemp: any = UpdateData[i].dateFormatted.split("-");
      RelativeHumidityData.push([
        Date.UTC(TimeTemp[0], TimeTemp[1], TimeTemp[2], TimeTemp[3], TimeTemp[4]),
        UpdateData[i].relativeHumidities
      ]);
    };
    
    chart.series[0].update({
      data: RelativeHumidityData
    }, true);
  }
}