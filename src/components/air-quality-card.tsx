"use client";

interface AirQualityData {
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

interface AirQualityCardProps {
  data: AirQualityData;
}

export function AirQualityCard({ data }: AirQualityCardProps) {
  // Get the first item from the list
  const airQuality = data.list[0];
  
  // AQI description based on OpenWeatherMap's scale
  const getAqiDescription = (aqi: number) => {
    switch (aqi) {
      case 1: return { label: "Good", color: "text-green-600 dark:text-green-400" };
      case 2: return { label: "Fair", color: "text-yellow-600 dark:text-yellow-400" };
      case 3: return { label: "Moderate", color: "text-orange-500 dark:text-orange-400" };
      case 4: return { label: "Poor", color: "text-red-500 dark:text-red-400" };
      case 5: return { label: "Very Poor", color: "text-purple-600 dark:text-purple-400" };
      default: return { label: "Unknown", color: "text-gray-600 dark:text-gray-400" };
    }
  };
  
  const aqiInfo = getAqiDescription(airQuality.main.aqi);
  
  return (
    <div className="weather-card">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Air Quality Index</h4>
        <span className={`px-2 py-1 rounded text-sm ${aqiInfo.color}`}>
          {aqiInfo.label}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-600 dark:text-gray-400">PM2.5</span>
          <span>{airQuality.components.pm2_5.toFixed(1)} μg/m³</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600 dark:text-gray-400">PM10</span>
          <span>{airQuality.components.pm10.toFixed(1)} μg/m³</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600 dark:text-gray-400">O₃</span>
          <span>{airQuality.components.o3.toFixed(1)} μg/m³</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600 dark:text-gray-400">NO₂</span>
          <span>{airQuality.components.no2.toFixed(1)} μg/m³</span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        <p>
          Air quality data is important for Indonesia's urban areas, especially in cities like Jakarta where pollution levels can be high.
        </p>
      </div>
    </div>
  );
}
