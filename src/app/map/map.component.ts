import { Component, OnInit } from '@angular/core';

import L from 'leaflet';

import * as GEOdata from '../../geojson/custom.geo.json';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})


export class MapComponet implements OnInit {

    maxZoom: number = 18;
    minZoom: number = 3;
    step: number = 0.25;
    thumbLabel: boolean = true;
    initZoom: number = 5;
    vertical: boolean = false;
    map: any;
    WorldGeoJson: any;

    constructor() {

    }

    ngOnInit() {
        // 建立 Leaflet 地圖，it must create after component is rendered, or Map container would not found
        // 要明確丟入event(e)，不然function內的this會是event而不是global
        //  var self = this;

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
       
        //自訂圖層
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
            onEachFeature: (feature, layer) =>{               
                this.onEachFeature(feature, layer)
            } 
        });//.addTo(this.map);
        
        //圖層設定
        var baseMaps = {
            "OpenStreetMap": osm,
            "Positron": positron,
            "Antique":antique,
            "Eco":eco
        };
        var overlayMaps = {
            "Boundary": this.WorldGeoJson,
            "MyLand": MyLand
        };

        //設定經緯度座標等初始值，匯入html div中
        this.map = L.map('MapDiv', {
            zoomSnap: this.step,
            worldCopyJump: false,
            layers: [osm, this.WorldGeoJson],
            maxBounds: [
                [-90, -180],
                [90, 180]
            ]
        });
        this.map.setView(new L.LatLng(23.6, 120.90), this.initZoom);
        L.control.layers(baseMaps, overlayMaps).addTo(this.map);
    }
    
    //#region Event about Leaflet
    onEachFeature(feature, layer) {        
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: (e)=> this.resetHighlight(e), 
            click:(e)=> this.zoomToFeature(e)
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
    }

    highlightFeature(e) {        
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    //#endregion
}