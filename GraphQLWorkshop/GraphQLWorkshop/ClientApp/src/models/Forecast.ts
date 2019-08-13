export interface Forecast {
    id: number;
    date: Date;
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
