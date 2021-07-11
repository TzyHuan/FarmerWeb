import { Component, OnInit, Input } from '@angular/core';
import Highcharts from 'highcharts';
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

@Component({
    selector: 'window-dragChart',
    templateUrl: './dragChart.component.html',
    styleUrls: ['../window.component.css'],
})

export class DragChartComponent implements OnInit {

    @Input('windowTitle') title: string;
    // Highchart
    cahrt: Highcharts.Chart;

    constructor() {
    }

    ngOnInit() {
        // 塞資料入highchart //todo
        this.createHighchart();
    }

    createHighchart() {
        this.cahrt = Highcharts.chart('highcahrtContainer', {
            chart: {
                // width: 800
            },
            title: {
                text: 'Combination chart'
            },
            xAxis: {
                categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
            },
            series: [{
                type: 'column',
                name: 'Jane',
                data: [3, 2, 1, 3, 4]
            }, {
                type: 'column',
                name: 'John',
                data: [2, 3, 5, 7, 6]
            }, {
                type: 'column',
                name: 'Joe',
                data: [4, 3, 3, 9, 0]
            }, {
                type: 'spline',
                name: 'Average',
                data: [3, 2.67, 3, 6.33, 3.33],
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }]
        });
    }

    onResizing(event: Event) {
        // Highchart automatic resize to the div
        this.cahrt.reflow();
    }
}
