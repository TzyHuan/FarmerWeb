import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
require('leaflet.markercluster');
import * as icon from 'leaflet/dist/images/marker-icon.png';
import * as iconShadow from 'leaflet/dist/images/marker-shadow.png';
import * as GEOdata from '../../geojson/custom.geo.json';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})

export class MapComponet implements OnInit {
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

    constructor() {

    }

    ngOnInit() {
        // 消除footer
        // var element = document.getElementsByClassName('push');        
        // element[0].style.display='none';
        // console.log(element);

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
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
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
            ]
        });
        this.map.doubleClickZoom.disable();

        //設定初始中心
        this.map.setView(new L.LatLng(23.6, 120.90), this.initZoom);

        //加入圖層控制項
        L.control.layers(baseMaps, overlayMaps).addTo(this.map);
     
        //#endregion

        //#region Legend Control
        //監聽地圖是否正在調整Zoom
        this.map.on({
            zoom: () => {
                this.Zoom = this.map.getZoom();
            },
            dblclick:(e)=>{
                //滑鼠座標點擊位置
                //todo
                console.log(e.latlng);
            }
        })

        this.infoControl = L.control({ position: 'bottomright' });

        this.infoControl.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        this.infoControl.update = function (props) {
            this._div.innerHTML = '<h4>Information of the country</h4>' + (props ?
                '<b>' + props.name + '</b><br />' + props.pop_est + ' people'
                : 'Hover over a place');
        };

        this.infoControl.addTo(this.map);
        //#endregion
    }

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
}