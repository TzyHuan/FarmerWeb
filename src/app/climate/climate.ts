export class WeatherStation {
    public stationId: number;
    public stationName: string;
    constructor() { }
}

export class HighchartsTempratures {
    public dateFormatted: Date;
    public temperatureC: number;
    constructor() { }
}

export class HighchartsHumidities {
    public dateFormatted: Date;
    public relativeHumidities: number;
    constructor() { }
}