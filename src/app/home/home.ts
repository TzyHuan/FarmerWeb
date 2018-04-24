export interface WeatherTemperature {
    dateFormatted: string;
    temperatureC: string;
}

export interface RealtimeData {
    StationId: number;
    RecTemp: number;
    RecRH: number;
}