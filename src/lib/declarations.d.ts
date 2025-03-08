// Type declarations for modules without types

declare module 'openweather-apis' {
  export function setLang(language: string): void;
  export function setUnits(units: string): void;
  export function setAPPID(apiKey: string): void;
  export function setCity(city: string): void;
  export function getSmartJSON(callback: (err: any, data: any) => void): void;
  export function getWeatherForecastForDays(days: number, callback: (err: any, data: any) => void): void;
  // Add other methods as needed
}

declare module 'weather-js' {
  interface WeatherOptions {
    search: string;
    degreeType: string;
  }
  
  interface WeatherLocation {
    name: string;
    zipcode?: string;
    lat: string;
    long: string;
    timezone: string;
    alert?: string;
    degreetype: string;
    imagerelativeurl: string;
  }
  
  interface WeatherForecast {
    low: string;
    high: string;
    skycodeday: string;
    skytextday: string;
    date: string;
    day: string;
    shortday: string;
    precip: string;
  }
  
  interface WeatherCurrent {
    temperature: string;
    skycode: string;
    skytext: string;
    date: string;
    observationtime: string;
    observationpoint: string;
    feelslike: string;
    humidity: string;
    winddisplay: string;
    windspeed: string;
    imageUrl: string;
  }
  
  interface WeatherResult {
    location: WeatherLocation;
    current: WeatherCurrent;
    forecast: WeatherForecast[];
  }
  
  export function find(options: WeatherOptions, callback: (err: Error | null, result: WeatherResult[]) => void): void;
}

// If we have other modules that need type declarations, add them here
