import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { HttpParams } from '@angular/common/http'

import { ClimateService } from '../../api/greenhouse/climate.service'
import { StationInfoService } from '../../api/greenhouse/station_into.service';
import { HighchartsTempratures, HighchartsHumidities } from '../../interface/greenhouse/climate';
import { StationInfo } from '../../interface/greenhouse/station_info'

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
  providers: [ClimateService, StationInfoService]
})

export class ClimateComponent implements AfterContentInit {

  stations: StationInfo[];
  selectedStations: StationInfo = new StationInfo();
  humidityChart: any;
  temperatureChart: any;
  @ViewChild('humidityChart') humidityChartEle: ElementRef;
  @ViewChild('temperatureChart') temperatureChartEle: ElementRef;

  constructor(
    private climateService: ClimateService,
    private stationInfoService: StationInfoService,
  ) {
    // 抓Station Selector選項
    this.stationInfoService.getStationInfo().subscribe((result: StationInfo[]) => {
      this.stations = result;
      //預設初始選項為第一個選項
      this.selectedStations = this.stations[0];
    }, (error) => {
      console.error(error);
    });
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
    this.temperatureChart = new Highcharts.stockChart(this.temperatureChartEle.nativeElement, optionsA);
    this.humidityChart = new Highcharts.stockChart(this.humidityChartEle.nativeElement, optionsB);

    //初始查詢條件
    const params = new HttpParams()
      .set('StationId', String(this.selectedStations.stationId))
      .set('SearchNum', "10000");

    //置入資料至溫度的Highstock
    this.climateService.getTemperatures(params).subscribe((result: HighchartsTempratures[]) => {
      this.drawTempHighcharts(this.temperatureChart, result);
    }, (error) => {
      console.error(error);
    });

    //置入資料至溫度的Highstock
    this.climateService.getRelativeHumidities(params).subscribe((result: HighchartsHumidities[]) => {
      this.drawRhHighcharts(this.humidityChart, result);
    }, (error) => {
      console.error(error);
    });
  };

  onSelect(stationId: number) {
    //this.selectedStations;
    this.stations.forEach(value => {
      if (value.stationId == stationId) {
        this.selectedStations = value;
      }
    });

    const params = new HttpParams()
      .set('StationId', stationId.toString())
      .set('SearchNum', "100000");

    this.climateService.getTemperatures(params).subscribe(
      (result: HighchartsTempratures[]) => {
        this.drawTempHighcharts(this.temperatureChart, result);
      }, (error) => {
        console.error(error);
      });

    this.climateService.getRelativeHumidities(params).subscribe(
      (result: HighchartsHumidities[]) => {
        this.drawRhHighcharts(this.humidityChart, result);
      }, (error) => {
        console.error(error);
      });
  }

  private drawTempHighcharts(chart: Highcharts.ChartObject, updateData: any[]) {
    let temperatureData: any = [];
    updateData.forEach(v=>{
      let timeTemp: any = v.dateFormatted.split("-");
      temperatureData.push([
        Date.UTC(timeTemp[0], timeTemp[1], timeTemp[2], timeTemp[3], timeTemp[4]),
        v.temperatureC
      ]);
    });
    chart.series[0].update({ data: temperatureData }, true);
  }

  private drawRhHighcharts(chart: Highcharts.ChartObject, updateData: any[]) {
    let relativeHumidityData: any = [];
    updateData.forEach(v=>{
      let timeTemp: any = v.dateFormatted.split("-");
      relativeHumidityData.push([
        Date.UTC(timeTemp[0], timeTemp[1], timeTemp[2], timeTemp[3], timeTemp[4]),
        v.relativeHumidities
      ]);
    });
    chart.series[0].update({ data: relativeHumidityData }, true);
  }
}