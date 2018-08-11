import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';

import L from 'leaflet';
import { GeoSearchControl, EsriProvider } from 'leaflet-geosearch';
require('leaflet.markercluster');

import * as icon from 'leaflet/dist/images/marker-icon.png';
import * as iconShadow from 'leaflet/dist/images/marker-shadow.png';
import * as GEOdata from '../../geojson/custom.geo.json';

import { DialogSupplyChainCreateComponent } from './dialog/dialog-supplychain-create.component';
import { DialogSupplyChainDeleteComponent } from './dialog/dialog-supplychain-delete.component';
import { v34 } from '../ApiKmv/v34';
import { V34Service } from '../ApiKmv/v34.service';

import Highcharts from 'highcharts';
require('highcharts/modules/series-label')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

//import * as $ from 'jquery/dist/jquery.min.js';
import "jquery-ui/ui/widgets/draggable.js";
declare var $: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers: [V34Service]
})

export class MapComponet implements OnInit, OnDestroy {
    //slider
    maxZoom: number = 18;
    minZoom: number = 3;
    step: number = 0.25;
    thumbLabel: boolean = true;
    initZoom: number = 5;
    Zoom: number = 5;
    vertical: boolean = true;

    //leaflet
    map: any;
    WorldGeoJson: any;
    infoControl: any;
    slideControl: any;
    SideList: v34[] = [];

    constructor(private REST_v34: V34Service, public dialog: MatDialog) {

//隱藏footer      
var element = document.getElementsByClassName('push');
(element[0] as HTMLElement).style.display = 'none';
var element = document.getElementsByClassName('wrapper');
(element[0] as HTMLElement).style.display = 'contents';

        $(function () {
            $(".selector").draggable({
                handle:"p",
                containment: "#MapDiv"
            });    
           
        });

        //事件：視窗大小變換時，leaflet一起變動
        window.onresize = (event: any) => {
            resizeToScreen(document.getElementById('MapDiv'), 56);
            resizeToScreen(document.getElementById('MapDetail'), 56);
        };
    }

    //初始化地圖
    ngOnInit() {
        

        //拖曳div
        //dragElement(document.getElementById("mydiv"));

        //leaflet heigh 初始化
        resizeToScreen(document.getElementById('MapDiv'), 56);
        resizeToScreen(document.getElementById('MapDetail'), 56);
        //建立地圖
        this.createMap();
        //抓側欄資料
        this.getSideDetail();
        //塞highchart //todo
        //this.createHighchart();
        
    }

    createMap() {
        // 建立 Leaflet 地圖，it must create after component is rendered, or Map container would not found
        // 要明確丟入event(e)，不然function內的this會是event而不是global
        //  var self = this;

        // 有bug需手動抓，Webpack在leaflet Icon圖案_getIconUrl抓預設圖案url時字串有問題
        // https://github.com/Leaflet/Leaflet/issues/4968
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: icon,
            shadowUrl: iconShadow,
        });

        // 設定底圖資來源
        var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var PositronUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
        var AntiqueUrl = 'https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png';
        var EcoUrl = 'https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png';

        var option = {
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        }

        var osm = new L.TileLayer(osmUrl, option);
        var positron = new L.TileLayer(PositronUrl, option);
        var antique = new L.TileLayer(AntiqueUrl, option);
        var eco = new L.TileLayer(EcoUrl, option);

        // GeoJSON圖檔
        this.WorldGeoJson = new L.geoJson(GEOdata, {
            style: (feature) => {
                return {
                    weight: 2,
                    opacity: 1,
                    color: '#FED976',
                    fillColor: '#ADFF2F',
                    dashArray: '8',
                    fillOpacity: 0.1
                };
            },
            onEachFeature: (feature, layer) => {
                this.onEachFeature(feature, layer)
            }
        });

        //#region Markers標籤
        //自訂多邊形標籤
        var MyLand = L.polygon([
            [25.272156, 121.492556],
            [25.272322, 121.492739],
            [25.271947, 121.493200],
            [25.271692, 121.492967],
            [25.271950, 121.492656]
        ],
            {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5   // 透明度
            }
        )//.addTo(this.map)
            .bindPopup("三芝的地就沒碰到路呀...<br>荒涼~")
        //.openPopup();

        //自訂標籤
        var ClusterMarkers = L.markerClusterGroup({
            spiderLegPolylineOptions: {
                weight: 5, color: '#222', opacity: 0.5
            },
            // iconCreateFunction: (cluster)=> {
            //     return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
            // }
        });
        var MyMarker1 = L.marker([25.272156, 121.492556]).bindPopup('1'),
            MyMarker2 = L.marker([25.272322, 121.492739]).bindPopup('2'),
            MyMarker3 = L.marker([25.271947, 121.493200]).bindPopup('3'),
            MyMarker4 = L.marker([25.271692, 121.492967]).bindPopup('4'),
            MyMarker5 = L.marker([25.271950, 121.492656]).bindPopup('5');
        //var Markers = L.layerGroup([MyMarker1, MyMarker2, MyMarker3, MyMarker4,MyMarker5]);
        ClusterMarkers.addLayer(MyMarker1);
        ClusterMarkers.addLayer(MyMarker2);
        ClusterMarkers.addLayer(MyMarker3);
        ClusterMarkers.addLayer(MyMarker4);
        ClusterMarkers.addLayer(MyMarker5);
        //#endregion


        //#region 準備產出Map顯示於HTML
        //圖層設定
        var baseMaps = {
            "OpenStreetMap": osm,
            "Positron": positron,
            "Antique": antique,
            "Eco": eco
        };
        var overlayMaps = {
            "Countries": this.WorldGeoJson,
            "MyLand": MyLand,
            "Cluster": ClusterMarkers
        };

        //設定經緯度座標等初始值，匯入html div中
        this.map = L.map('MapDiv', {
            zoomSnap: this.step,
            worldCopyJump: false,
            layers: [osm, ClusterMarkers],
            maxBounds: [
                [-90, -180],
                [90, 180]
            ],
            maxBoundsViscosity: 1.0
        });
        this.map.doubleClickZoom.disable();

        //設定初始中心
        this.map.setView(new L.LatLng(23.6, 120.90), this.initZoom);

        //加入圖層控制項
        L.control.layers(baseMaps, overlayMaps).addTo(this.map);

        //加入地圖搜尋功能
        const provider = new EsriProvider();
        const searchControl = new GeoSearchControl({
            provider: provider,
        });
        this.map.addControl(searchControl);

        //#endregion

        //#region Legend Control
        //監聽地圖是否正在調整Zoom
        this.map.on({
            zoom: () => {
                this.Zoom = this.map.getZoom();
                //console.log(this.map);
                //this.map.setMaxBounds(this.map.getBounds());

            },
            dblclick: (e) => {
                //滑鼠座標點擊位置
                let data: v34 = new v34();
                data.v3435 = e.latlng.lat;
                data.v3436 = e.latlng.lng;

                this.openCreateDialog(data);
            },
            // mousemove: (e) => {
            //     console.log(e.latlng);
            // }
        })

        this.infoControl = L.control({ position: 'bottomright' });
        this.slideControl = L.control({ position: 'topleft' });

        this.infoControl.onAdd = function (map) {
            //這裡this為map
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"           
            L.DomEvent.disableClickPropagation(this._div);
            var draggable = new L.Draggable(this._div);
            draggable.enable();
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        this.infoControl.update = function (props) {
            this._div.innerHTML = '<div><h4>Information of the country</h4>' + (props ?
                '<b>' + props.name + '</b><br />' + props.pop_est + ' people'
                : 'Hover over a place') + '</div>';
        };

        

        this.slideControl.onAdd = function (map) {
            //這裡this為map            

            this._div = L.DomUtil.get('slider'); // get a div element                     
            var draggable = new L.Draggable(this._div);

            //統一由jquery控制draggable功能            
            //draggable.enable(); 
            //nonDraggable.disable();

            L.DomEvent.disableClickPropagation(this._div);           
            
            var self = this;

            draggable.on('down', function (e) {
                //self.draggable.enable();   
            });

            draggable.on('drag', function (e) {

                // let point = L.DomUtil.getPosition(self._div);
                // let DivPosition = map.containerPointToLatLng(point);
                // let ViewMapBound = map.getBounds();

                // console.log(self._div)
                // console.log(point)
                // console.log(map.containerPointToLatLng(point));
                // console.log(map.getBounds());
                // console.log(ViewMapBound.contains(DivPosition))
            });

            return this._div;
        }

        this.infoControl.addTo(this.map);
        this.slideControl.addTo(this.map);
        //#endregion

        //#region 調整Map中div屬性，不被map影響
        //功能選單
        let dragAction = L.DomUtil.get('dragAction');
        L.DomEvent.disableClickPropagation(dragAction);

        //統計圖表
        let dragChart = L.DomUtil.get('dragChart'); // get a div element        
        L.DomEvent.disableClickPropagation(dragChart);       

        //#endregion
    }

    ngOnDestroy() {
        //回復footer隱藏特例
        var element = document.getElementsByClassName('push');
        (element[0] as HTMLElement).style.display = '';
        var element = document.getElementsByClassName('wrapper');
        (element[0] as HTMLElement).style.display = '';
    }

    getSideDetail() {
        this.REST_v34.GetV34().subscribe((result: v34[]) => {
            this.SideList = result;
        });
    }

    //#region Dialogs
    openCreateDialog(data: v34): void {

        const dialogRef = this.dialog.open(DialogSupplyChainCreateComponent, {
            width: '80%',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            //this.loadData();
        });
    }
    openDeleteDialog(item: v34): void {
        const dialogRef = this.dialog.open(DialogSupplyChainDeleteComponent, {
            width: '250px',
            data: item
        });

        dialogRef.afterClosed().subscribe(result => {
            //刷新側欄
            this.getSideDetail();
        });
    }

    openUpdateDialog(item: v34): void {
        // const dialogRef = this.dialog.open(DialogMenuUpdateComponent, {
        //     width: '400px',
        //     data: [MenuDetial, this.MenuList]
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     //console.log('The dialog was closed');
        //     this.loadData();
        // });
        console.log(item)
    }
    //#endregion

    //#region Event function about Leaflet
    onEachFeature(feature, layer) {
        layer.on({
            mouseover: (e) => this.highlightFeature(e),
            mouseout: (e) => this.resetHighlight(e),
            click: (e) => this.zoomToFeature(e)
        });
    }

    adjustZoom(value: number) {
        this.map.setZoom(value);
    }

    zoomToFeature(e) {
        this.map.fitBounds(e.target.getBounds());
    }

    resetHighlight(e) {
        this.WorldGeoJson.resetStyle(e.target);
        this.infoControl.update();
    }

    highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 4,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.6
        });

        this.infoControl.update(layer.feature.properties);

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    //#endregion    

    createHighchart() {
        Highcharts.chart('highcahrtContainer', {
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
}

function resizeToScreen(element, diff) {
    var wHeight = window.innerHeight;
    var objHeight = wHeight - diff;
    element.style.height = objHeight + "px";
}