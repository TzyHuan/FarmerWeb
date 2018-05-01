export interface WeatherTemperature {
    dateFormatted: string;
    temperatureC: string;
}

export interface RealtimeData {
    StationId: number;
    stationName: string;
    recTemp: number;
    recRH: number;
}

export class WeatherStation {
    public stationId: number;
    public stationName: string;
    constructor() { }
}