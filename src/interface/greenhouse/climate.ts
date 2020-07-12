export class HighchartsTempratures {
    dateFormatted: Date;
    temperatureC: number;
}

export class LineChartData {
    public obsTime: Date | number;
    public data: number;

    public constructor(init?: Partial<LineChartData>) {
        Object.assign(this, init);
    }
}

export class Climate {
    public obsTime: Date;
    public temperature: number;
    public rh: number;
    public lux: number;
}