import { Component, OnInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { HttpParams } from '@angular/common/http'

import { ClimateService } from './climate.service'
import { WeatherStation, HighchartsData } from './climate'

import * as Highcharts from 'highcharts/highstock';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

@Component({
  selector: 'climate',
  templateUrl: './climate.component.html',
  styleUrls: ['./climate.component.css'],
  providers: [ClimateService]
})

export class ClimateComponent implements OnInit, AfterContentInit {
  public chart: any;
  @ViewChild('chartTarget') chartTarget: ElementRef;
  public title: string;
  public stations: WeatherStation[];
  public selectedStations: WeatherStation = new WeatherStation();


  constructor(private ClimatrREST: ClimateService) {
    // 抓Station Selector選項
    this.ClimatrREST.getSelectItem()
      .subscribe(
        result => {
          this.stations = result;
          //console.log(result);
        },
        error => console.error(error));
  };

  ngOnInit() {
    this.title = 'what the hell....';
  };

  ngAfterContentInit() {
    const options: Highcharts.Highstock.Options = {
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
    this.chart = Highcharts.stockChart(this.chartTarget.nativeElement, options);
    this.ClimatrREST.getTemperatute()
      .subscribe(
        (result: HighchartsData[]) => {
          console.log('ngAfterContentInit');
          this.DrawHighcharts(this.chart, result);
        }, error => console.error(error));
  };


  onSelect(StationId: number) {
    //this.selectedStations;
    for (var i = 0; i < this.stations.length; i++) {
      if (this.stations[i].stationNum == StationId) {
        this.selectedStations = this.stations[i];
      }
    }

    const params = new HttpParams()
      .set('StationNum', StationId.toString())
      .set('SearchNum', "100000");

    this.ClimatrREST.getTemperatute(params)
      .subscribe(
        (result: HighchartsData[]) => {
          console.log('onSelect');
          //console.log(result);
          this.DrawHighcharts(this.chart, result);
        }, error => console.error(error));
  }

  private DrawHighcharts(chart: Highcharts.ChartObject, UpdateData: any) {
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
}

