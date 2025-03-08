interface WeatherDetailProps {
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

export function WeatherDetail({
  humidity,
  windSpeed,
  pressure,
  visibility,
  sunrise,
  sunset,
  timezone
}: WeatherDetailProps) {
  // Format sunrise and sunset times with timezone
  const formatTime = (timestamp: number, timezoneOffset: number) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const sunriseTime = formatTime(sunrise, timezone);
  const sunsetTime = formatTime(sunset, timezone);
  
  // Convert visibility from meters to kilometers
  const visibilityKm = (visibility / 1000).toFixed(1);
  
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400">Humidity</span>
        <span className="font-medium">{humidity}%</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400">Wind Speed</span>
        <span className="font-medium">{windSpeed} m/s</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400">Pressure</span>
        <span className="font-medium">{pressure} hPa</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400">Visibility</span>
        <span className="font-medium">{visibilityKm} km</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400">Sunrise</span>
        <span className="font-medium">{sunriseTime}</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400">Sunset</span>
        <span className="font-medium">{sunsetTime}</span>
      </div>
    </div>
  );
}
