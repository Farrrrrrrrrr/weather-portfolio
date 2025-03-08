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

// If we have other modules that need type declarations, add them here
